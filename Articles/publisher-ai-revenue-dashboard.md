---
title:: Build a Publisher AI Revenue Dashboard: Track Licensing Income, Traffic Impact, and ROI Metrics
description:: Executive dashboard tracking AI licensing revenue streams, crawler-induced traffic displacement, negotiation pipeline value, and net profitability across multiple AI partnerships.
focus_keyword:: AI revenue dashboard
category:: Analytics & Reporting
author:: Victor Valentine Romo
date:: 2026.02.08
---

# Build a Publisher AI Revenue Dashboard: Track Licensing Income, Traffic Impact, and ROI Metrics

**Publishers managing AI licensing portfolios across 3-8 simultaneous partnerships lack unified visibility into financial performance.** Revenue arrives via different payment schedules (monthly, quarterly, annual), traffic impact varies by crawler behavior and licensing terms, and profitability calculations require attributing infrastructure costs, legal fees, and opportunity costs against gross licensing income.

**Executive dashboards** consolidate these fragmented data streams into single-page visibility. Decision-makers assess at a glance: total AI licensing revenue (trailing 12 months and projected forward), revenue per AI partner with growth trends, traffic displacement quantified in lost pageviews and ad revenue, cost attribution showing net profitability, and pipeline value tracking negotiations in progress.

This guide implements production-grade dashboards using Google Sheets (accessible option) or Grafana + PostgreSQL (enterprise option). Both approaches connect to data sources publishers already operate: web analytics platforms, server access logs, accounting systems, and CRM tools tracking licensing negotiations.

## Dashboard Architecture: Data Sources and Integration Points

**Four core data sources** feed AI revenue dashboards: financial data (invoices, payments received), web analytics (traffic volumes, user behavior), server infrastructure (crawler activity logs, bandwidth costs), and business intelligence (deal pipeline, negotiation stages).

**Financial data integration** typically originates from accounting software (QuickBooks, Xero, NetSuite) or manual invoice tracking spreadsheets. Key metrics extracted:

- **Invoice date, payment due date, payment received date** — track payment timing and identify late payments
- **Invoice amount, payment amount** — gross revenue per deal
- **AI company identifier** — attribute revenue to specific partnerships
- **Contract period** — annual vs. multi-year deals, renewal dates
- **Payment terms** — net-30, net-60, quarterly installments
- **Deal type** — fixed annual fee, consumption-based, hybrid structure

Export this data monthly as CSV from your accounting system. Structure format:

```
deal_id,ai_company,invoice_date,due_date,payment_date,invoice_amount,payment_amount,contract_start,contract_end,deal_type
LC2024001,OpenAI,2024-03-15,2024-04-14,2024-04-10,50000,50000,2024-01-01,2024-12-31,fixed_annual
LC2024002,Anthropic,2024-03-20,2024-04-19,2024-04-25,75000,75000,2024-02-01,2027-01-31,fixed_annual
LC2024003,Cohere,2024-04-01,2024-05-01,,12500,0,2024-04-01,2025-03-31,consumption_based
```

**Web analytics integration** pulls traffic data from Google Analytics, Adobe Analytics, or Matomo. Required metrics:

- **Total pageviews by source** — organic search, direct, referral, social
- **Pageviews by content type** — articles, guides, documentation
- **Time-series data** — daily or weekly granularity for trend analysis
- **Session engagement** — time on page, bounce rate as quality indicators

Export via analytics platform APIs. Google Analytics Data API example:

```python
from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import RunReportRequest, DateRange, Metric, Dimension

def export_traffic_data(property_id, start_date, end_date):
    client = BetaAnalyticsDataClient()

    request = RunReportRequest(
        property=f"properties/{property_id}",
        date_ranges=[DateRange(start_date=start_date, end_date=end_date)],
        dimensions=[
            Dimension(name="date"),
            Dimension(name="sessionDefaultChannelGroup")
        ],
        metrics=[
            Metric(name="screenPageViews"),
            Metric(name="sessions"),
            Metric(name="engagementRate")
        ]
    )

    response = client.run_report(request)

    # Convert to CSV format
    rows = []
    for row in response.rows:
        rows.append({
            'date': row.dimension_values[0].value,
            'channel': row.dimension_values[1].value,
            'pageviews': row.metric_values[0].value,
            'sessions': row.metric_values[1].value,
            'engagement_rate': row.metric_values[2].value
        })

    return rows
```

Run this export weekly, store results in CSV or database for dashboard consumption.

**Server infrastructure data** comes from [web server access logs](prometheus-grafana-ai-crawler-metrics.html) parsed for AI crawler activity. Key metrics:

- **Request volume per crawler** — total requests by GPTBot, ClaudeBot, etc.
- **Bandwidth consumption per crawler** — bytes transferred
- **Content targeting patterns** — which site sections crawlers access most
- **Robots.txt violations** — attempts to access blocked resources

Parse logs using existing monitoring infrastructure or standalone scripts:

```python
import re
from collections import defaultdict
from datetime import datetime

AI_CRAWLERS = {
    'OpenAI': r'GPTBot',
    'Anthropic': r'ClaudeBot',
    'Google': r'Google-Extended',
    'CommonCrawl': r'CCBot',
    'Cohere': r'cohere-ai'
}

def parse_crawler_activity(log_file, start_date, end_date):
    activity = defaultdict(lambda: {'requests': 0, 'bandwidth': 0})

    with open(log_file, 'r') as f:
        for line in f:
            match = re.search(r'\[(\d{2}/\w{3}/\d{4}:\d{2}:\d{2}:\d{2})', line)
            if not match:
                continue

            log_date = datetime.strptime(match.group(1), '%d/%b/%Y:%H:%M:%S')
            if not (start_date <= log_date <= end_date):
                continue

            for company, pattern in AI_CRAWLERS.items():
                if re.search(pattern, line):
                    bytes_match = re.search(r'"\s+\d{3}\s+(\d+)\s+"', line)
                    if bytes_match:
                        activity[company]['requests'] += 1
                        activity[company]['bandwidth'] += int(bytes_match.group(1))

    return activity
```

Run weekly alongside financial and analytics exports.

**Business intelligence data** tracks licensing deal pipeline and negotiation progress. Source from CRM (Salesforce, HubSpot) or manual spreadsheet tracking:

- **Prospect company** — AI companies in outreach pipeline
- **Deal stage** — initial contact, proposal sent, negotiation, legal review, signed
- **Estimated value** — projected annual revenue from deal
- **Probability** — weighted likelihood of closing (e.g., 25% at proposal stage, 75% at legal review)
- **Expected close date** — projected contract signature date
- **Key contact** — business development lead at AI company

Structure pipeline export:

```
prospect_id,ai_company,deal_stage,estimated_value,probability,expected_close_date,last_contact_date
PIP001,Perplexity,negotiation,80000,0.50,2026-05-15,2026-02-01
PIP002,Cohere,legal_review,120000,0.75,2026-03-30,2026-02-05
PIP003,Meta,initial_contact,200000,0.10,2026-08-01,2026-01-15
```

Update pipeline data weekly as deal stages evolve.

## Google Sheets Implementation: Accessible Executive Dashboard

**Google Sheets** provides rapid deployment for publishers lacking dedicated engineering resources. This approach requires no coding infrastructure, updates via manual CSV imports or Google Analytics add-ons, and renders in familiar spreadsheet interfaces executives already use.

**Dashboard structure** uses five connected sheets:

1. **Revenue Summary** — executive overview with key metrics
2. **Financial Data** — imported payment records
3. **Traffic Data** — imported analytics
4. **Crawler Activity** — imported server logs
5. **Pipeline Tracker** — deal negotiation status

### Sheet 1: Revenue Summary (Executive View)

Create executive summary displaying:

**Key Metrics Section** (auto-calculated from other sheets):
- Total AI Licensing Revenue (TTM) — trailing twelve months
- Current Month Revenue
- Revenue Growth Rate (MoM)
- Active Partnerships Count
- Pipeline Value (weighted)

Implement using formulas referencing Financial Data sheet:

```
Total AI Revenue (TTM):
=SUMIFS('Financial Data'!F:F, 'Financial Data'!C:C, ">="&TODAY()-365, 'Financial Data'!G:G, "<>0")

Current Month Revenue:
=SUMIFS('Financial Data'!F:F, 'Financial Data'!C:C, ">="&DATE(YEAR(TODAY()),MONTH(TODAY()),1), 'Financial Data'!G:G, "<>0")

Revenue Growth Rate:
=(Current_Month_Revenue - Prior_Month_Revenue) / Prior_Month_Revenue
```

**Revenue by Partner** (horizontal bar chart):
Pull from Financial Data sheet, group by `ai_company`, sum `payment_amount` where `payment_date` is not null.

Create data range:
```
AI Company | TTM Revenue
OpenAI     | =SUMIFS('Financial Data'!G:G, 'Financial Data'!B:B, "OpenAI", 'Financial Data'!C:C, ">="&TODAY()-365)
Anthropic  | =SUMIFS('Financial Data'!G:G, 'Financial Data'!B:B, "Anthropic", 'Financial Data'!C:C, ">="&TODAY()-365)
Google     | =SUMIFS('Financial Data'!G:G, 'Financial Data'!B:B, "Google", 'Financial Data'!C:C, ">="&TODAY()-365)
```

Insert chart: Insert → Chart → Bar chart, select data range above.

**Traffic Impact Visualization** (line chart with dual axes):
- Primary axis: Total monthly pageviews (from Traffic Data sheet)
- Secondary axis: AI crawler requests (from Crawler Activity sheet)

Create monthly aggregation:
```
Month       | Total Pageviews | AI Requests
2025-08     | =SUMIFS('Traffic Data'!C:C, 'Traffic Data'!A:A, ">=2025-08-01", 'Traffic Data'!A:A, "<2025-09-01")
2025-09     | =SUMIFS('Traffic Data'!C:C, 'Traffic Data'!A:A, ">=2025-09-01", 'Traffic Data'!A:A, "<2025-10-01")
```

Insert combo chart showing traffic trends alongside crawler activity.

**Net Profitability Analysis**:
Revenue minus attributed costs:

```
Gross Revenue: [Sum of all payments received]
- Infrastructure Costs: [Bandwidth costs from crawler activity × $0.09/GB]
- Legal Fees: [Sum of legal review costs per deal]
- Staff Time: [Hours spent × hourly rate]
= Net Profit from AI Licensing
```

Calculate ROI:
```
ROI = (Net Profit / Total Costs) × 100%
```

Display in prominent cells with conditional formatting (green if >200% ROI, yellow 50-200%, red <50%).

### Sheet 2: Financial Data Import

Manual CSV import process:

1. Export invoice/payment data from accounting software monthly
2. Google Sheets: File → Import → Upload CSV
3. Select "Replace current sheet" for Financial Data tab
4. Verify column mappings match expected structure

Automate using Google Apps Script for advanced users:

```javascript
function importFinancialData() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Financial Data');
  var csvUrl = 'https://your-accounting-software.com/export/invoices.csv';

  var response = UrlFetchApp.fetch(csvUrl, {
    headers: { 'Authorization': 'Bearer YOUR_API_TOKEN' }
  });

  var csvData = Utilities.parseCsv(response.getContentText());
  sheet.getRange(2, 1, csvData.length, csvData[0].length).setValues(csvData);
}
```

Set trigger to run monthly: Edit → Current project's triggers → Add trigger → `importFinancialData`, Time-driven, Month timer.

### Sheet 3: Traffic Data Import

Connect Google Analytics directly using Google Analytics add-on:

1. Extensions → Add-ons → Get add-ons → Search "Google Analytics"
2. Install official Google Analytics add-on
3. Add-ons → Google Analytics → Create new report
4. Configure report:
   - Metrics: ga:pageviews, ga:sessions
   - Dimensions: ga:date, ga:channelGrouping
   - Segment: All Users
   - Date range: Last 90 days
5. Run report → data populates in new sheet
6. Rename sheet to "Traffic Data"

Schedule automatic refresh: Report Configuration → Enable reports to run automatically (daily).

### Sheet 4: Crawler Activity Import

Manual CSV import from server log analysis:

1. Run weekly log parsing script (provided earlier) outputting CSV
2. Import CSV into "Crawler Activity" sheet
3. Aggregate data by week for cleaner visualization

Formula to calculate weekly totals:
```
Week Starting | Crawler      | Requests | Bandwidth GB
=DATE(...)    | OpenAI       | =SUM()   | =SUM()/1e9
```

### Sheet 5: Pipeline Tracker

Manual entry tracking ongoing negotiations:

Columns:
- Company
- Stage (dropdown: Contact, Proposal, Negotiation, Legal, Signed)
- Estimated Value
- Probability (dropdown: 10%, 25%, 50%, 75%, 90%)
- Weighted Value (formula: =Estimated_Value × Probability)
- Expected Close Date
- Days to Close (formula: =Expected_Close_Date - TODAY())
- Last Activity Date
- Next Action

Calculate total pipeline value:
```
Weighted Pipeline Value = SUM(Weighted_Value column)
```

Display in Revenue Summary sheet with breakdown by stage.

**Dashboard refresh cadence**:
- Financial Data: Monthly (after invoicing cycle)
- Traffic Data: Daily (automated via GA add-on)
- Crawler Activity: Weekly (manual CSV import)
- Pipeline Tracker: Weekly (manual updates)

## Grafana + PostgreSQL Implementation: Enterprise Dashboard

**Enterprise publishers** with engineering resources benefit from automated, real-time dashboards using Grafana visualization platform backed by PostgreSQL database.

**Architecture overview**:
- PostgreSQL database stores all metrics (financial, traffic, crawler, pipeline)
- ETL scripts extract data from source systems, transform, load into PostgreSQL
- Grafana connects to PostgreSQL, builds dashboards via SQL queries
- Automated refresh: ETL runs hourly/daily via cron, Grafana queries database in real-time

### Database Schema Design

Create PostgreSQL database with four core tables:

```sql
-- Financial transactions
CREATE TABLE ai_licensing_revenue (
    id SERIAL PRIMARY KEY,
    deal_id VARCHAR(50) UNIQUE NOT NULL,
    ai_company VARCHAR(100) NOT NULL,
    invoice_date DATE NOT NULL,
    due_date DATE NOT NULL,
    payment_date DATE,
    invoice_amount NUMERIC(10,2) NOT NULL,
    payment_amount NUMERIC(10,2),
    contract_start DATE NOT NULL,
    contract_end DATE NOT NULL,
    deal_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Website traffic metrics
CREATE TABLE traffic_metrics (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    channel VARCHAR(50) NOT NULL,
    pageviews INTEGER NOT NULL,
    sessions INTEGER NOT NULL,
    engagement_rate NUMERIC(5,4),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(date, channel)
);

-- AI crawler activity
CREATE TABLE crawler_activity (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    ai_company VARCHAR(100) NOT NULL,
    requests INTEGER NOT NULL,
    bandwidth_bytes BIGINT NOT NULL,
    unique_paths INTEGER,
    avg_response_time_ms INTEGER,
    robots_violations INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(date, ai_company)
);

-- Deal pipeline
CREATE TABLE deal_pipeline (
    id SERIAL PRIMARY KEY,
    prospect_id VARCHAR(50) UNIQUE NOT NULL,
    ai_company VARCHAR(100) NOT NULL,
    deal_stage VARCHAR(50) NOT NULL,
    estimated_value NUMERIC(10,2) NOT NULL,
    probability NUMERIC(3,2) NOT NULL,
    expected_close_date DATE,
    last_contact_date DATE,
    notes TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Create indexes for query performance:

```sql
CREATE INDEX idx_revenue_company ON ai_licensing_revenue(ai_company);
CREATE INDEX idx_revenue_payment_date ON ai_licensing_revenue(payment_date);
CREATE INDEX idx_traffic_date ON traffic_metrics(date);
CREATE INDEX idx_crawler_date_company ON crawler_activity(date, ai_company);
CREATE INDEX idx_pipeline_stage ON deal_pipeline(deal_stage);
```

### ETL Pipeline Implementation

**Financial data ETL** (Python script scheduled via cron):

```python
import psycopg2
import csv
from datetime import datetime

def load_financial_data(csv_file_path, db_connection):
    with open(csv_file_path, 'r') as f:
        reader = csv.DictReader(f)

        cursor = db_connection.cursor()

        for row in reader:
            cursor.execute("""
                INSERT INTO ai_licensing_revenue
                (deal_id, ai_company, invoice_date, due_date, payment_date,
                 invoice_amount, payment_amount, contract_start, contract_end, deal_type)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (deal_id) DO UPDATE SET
                    payment_date = EXCLUDED.payment_date,
                    payment_amount = EXCLUDED.payment_amount,
                    updated_at = CURRENT_TIMESTAMP
            """, (
                row['deal_id'], row['ai_company'],
                row['invoice_date'], row['due_date'],
                row['payment_date'] if row['payment_date'] else None,
                float(row['invoice_amount']),
                float(row['payment_amount']) if row['payment_amount'] else None,
                row['contract_start'], row['contract_end'], row['deal_type']
            ))

        db_connection.commit()
        cursor.close()

# Run daily
conn = psycopg2.connect("dbname=ai_revenue user=postgres password=xxx host=localhost")
load_financial_data('/data/exports/invoices.csv', conn)
conn.close()
```

**Traffic data ETL** (using Google Analytics Data API):

```python
from google.analytics.data_v1beta import BetaAnalyticsDataClient
import psycopg2

def load_traffic_data(property_id, db_connection, days_back=7):
    client = BetaAnalyticsDataClient()

    # Fetch last 7 days of traffic data
    request = RunReportRequest(
        property=f"properties/{property_id}",
        date_ranges=[DateRange(
            start_date=f"{days_back}daysAgo",
            end_date="today"
        )],
        dimensions=[Dimension(name="date"), Dimension(name="sessionDefaultChannelGroup")],
        metrics=[Metric(name="screenPageViews"), Metric(name="sessions"), Metric(name="engagementRate")]
    )

    response = client.run_report(request)

    cursor = db_connection.cursor()

    for row in response.rows:
        cursor.execute("""
            INSERT INTO traffic_metrics (date, channel, pageviews, sessions, engagement_rate)
            VALUES (%s, %s, %s, %s, %s)
            ON CONFLICT (date, channel) DO UPDATE SET
                pageviews = EXCLUDED.pageviews,
                sessions = EXCLUDED.sessions,
                engagement_rate = EXCLUDED.engagement_rate
        """, (
            row.dimension_values[0].value,
            row.dimension_values[1].value,
            int(row.metric_values[0].value),
            int(row.metric_values[1].value),
            float(row.metric_values[2].value)
        ))

    db_connection.commit()
    cursor.close()

# Run daily
conn = psycopg2.connect("dbname=ai_revenue user=postgres password=xxx host=localhost")
load_traffic_data('YOUR_GA4_PROPERTY_ID', conn)
conn.close()
```

**Crawler activity ETL**:

```python
import psycopg2
from datetime import datetime, timedelta

def load_crawler_activity(log_analysis_results, db_connection):
    """
    log_analysis_results: dict from parse_crawler_activity() function
    """

    cursor = db_connection.cursor()

    for ai_company, data in log_analysis_results.items():
        cursor.execute("""
            INSERT INTO crawler_activity
            (date, ai_company, requests, bandwidth_bytes, robots_violations)
            VALUES (%s, %s, %s, %s, %s)
            ON CONFLICT (date, ai_company) DO UPDATE SET
                requests = crawler_activity.requests + EXCLUDED.requests,
                bandwidth_bytes = crawler_activity.bandwidth_bytes + EXCLUDED.bandwidth_bytes,
                robots_violations = crawler_activity.robots_violations + EXCLUDED.robots_violations
        """, (
            datetime.now().date(),
            ai_company,
            data['requests'],
            data['bandwidth'],
            data.get('violations', 0)
        ))

    db_connection.commit()
    cursor.close()

# Run daily from cron after log analysis
activity_data = parse_crawler_activity('/var/log/nginx/access.log', datetime.now() - timedelta(days=1), datetime.now())
conn = psycopg2.connect("dbname=ai_revenue user=postgres password=xxx host=localhost")
load_crawler_activity(activity_data, conn)
conn.close()
```

Schedule all ETL scripts via crontab:

```
# Financial data ETL - daily at 2am
0 2 * * * /usr/bin/python3 /opt/etl/load_financial_data.py

# Traffic data ETL - daily at 3am
0 3 * * * /usr/bin/python3 /opt/etl/load_traffic_data.py

# Crawler activity ETL - daily at 4am
0 4 * * * /usr/bin/python3 /opt/etl/load_crawler_activity.py
```

### Grafana Dashboard Configuration

Install Grafana and configure PostgreSQL data source:

```bash
# Install Grafana
sudo apt-get install -y adduser libfontconfig1
wget https://dl.grafana.com/oss/release/grafana_10.0.0_amd64.deb
sudo dpkg -i grafana_10.0.0_amd64.deb
sudo systemctl start grafana-server
```

Access Grafana at `http://localhost:3000`, add PostgreSQL data source:

Configuration → Data Sources → Add data source → PostgreSQL

Settings:
- Host: `localhost:5432`
- Database: `ai_revenue`
- User: `postgres`
- Password: `[your password]`
- SSL Mode: `disable` (or configure SSL)

**Create Executive Dashboard** with eight panels:

**Panel 1: Total AI Revenue (Stat)**

Query:
```sql
SELECT SUM(payment_amount) as total_revenue
FROM ai_licensing_revenue
WHERE payment_date >= CURRENT_DATE - INTERVAL '12 months'
  AND payment_amount IS NOT NULL
```

Visualization: Stat panel
Format: Currency ($)
Title: "AI Licensing Revenue (TTM)"

**Panel 2: Revenue by Partner (Bar Gauge)**

Query:
```sql
SELECT
    ai_company,
    SUM(payment_amount) as revenue
FROM ai_licensing_revenue
WHERE payment_date >= CURRENT_DATE - INTERVAL '12 months'
  AND payment_amount IS NOT NULL
GROUP BY ai_company
ORDER BY revenue DESC
```

Visualization: Bar gauge (horizontal)
Format: Currency ($)

**Panel 3: Monthly Revenue Trend (Time Series)**

Query:
```sql
SELECT
    DATE_TRUNC('month', payment_date) as month,
    SUM(payment_amount) as monthly_revenue
FROM ai_licensing_revenue
WHERE payment_date >= CURRENT_DATE - INTERVAL '24 months'
  AND payment_amount IS NOT NULL
GROUP BY month
ORDER BY month
```

Visualization: Time series line chart
X-axis: month
Y-axis: monthly_revenue (currency format)

**Panel 4: Traffic vs AI Crawler Activity (Dual-axis Time Series)**

Query:
```sql
SELECT
    t.date as time,
    SUM(t.pageviews) as total_pageviews,
    SUM(c.requests) as crawler_requests
FROM traffic_metrics t
LEFT JOIN crawler_activity c ON t.date = c.date
WHERE t.date >= CURRENT_DATE - INTERVAL '90 days'
GROUP BY t.date
ORDER BY t.date
```

Visualization: Time series with two Y-axes
Left axis: total_pageviews
Right axis: crawler_requests

**Panel 5: Crawler Bandwidth Consumption (Pie Chart)**

Query:
```sql
SELECT
    ai_company,
    SUM(bandwidth_bytes) / 1e9 as bandwidth_gb
FROM crawler_activity
WHERE date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY ai_company
```

Visualization: Pie chart
Format: Gigabytes (GB)

**Panel 6: Deal Pipeline Value (Table)**

Query:
```sql
SELECT
    ai_company,
    deal_stage,
    estimated_value,
    probability,
    estimated_value * probability as weighted_value,
    expected_close_date
FROM deal_pipeline
WHERE deal_stage != 'Signed'
ORDER BY weighted_value DESC
```

Visualization: Table
Columns: Company, Stage, Est. Value, Probability, Weighted Value, Expected Close

**Panel 7: Net Profitability (Stat with Sparkline)**

Query:
```sql
SELECT
    (SELECT SUM(payment_amount) FROM ai_licensing_revenue
     WHERE payment_date >= CURRENT_DATE - INTERVAL '12 months') as revenue,
    (SELECT SUM(bandwidth_bytes) * 0.09 / 1e9 FROM crawler_activity
     WHERE date >= CURRENT_DATE - INTERVAL '12 months') as bandwidth_cost,
    -- Add legal fees and staff costs from separate cost tracking table if available
    (SELECT SUM(payment_amount) FROM ai_licensing_revenue
     WHERE payment_date >= CURRENT_DATE - INTERVAL '12 months') -
    (SELECT SUM(bandwidth_bytes) * 0.09 / 1e9 FROM crawler_activity
     WHERE date >= CURRENT_DATE - INTERVAL '12 months') as net_profit
```

Visualization: Stat panel with sparkline
Format: Currency ($)
Title: "Net AI Licensing Profit (TTM)"

**Panel 8: Payment Status (Table)**

Query:
```sql
SELECT
    ai_company,
    invoice_date,
    due_date,
    payment_date,
    invoice_amount,
    payment_amount,
    CASE
        WHEN payment_date IS NULL AND due_date < CURRENT_DATE THEN 'OVERDUE'
        WHEN payment_date IS NULL THEN 'PENDING'
        WHEN payment_date <= due_date THEN 'ON TIME'
        ELSE 'LATE'
    END as status
FROM ai_licensing_revenue
WHERE invoice_date >= CURRENT_DATE - INTERVAL '6 months'
ORDER BY invoice_date DESC
```

Visualization: Table
Conditional formatting: Red row for OVERDUE, yellow for PENDING, green for ON TIME

Configure dashboard refresh: Dashboard settings → Auto refresh → 5 minutes

This configuration provides real-time executive visibility into AI licensing financial performance, integrating data from accounting, analytics, and infrastructure systems into unified metrics.

Publishers operating mature AI licensing programs use these dashboards for quarterly board presentations, investor updates, and internal performance reviews demonstrating AI monetization as a growing revenue line alongside traditional advertising and subscription income.
