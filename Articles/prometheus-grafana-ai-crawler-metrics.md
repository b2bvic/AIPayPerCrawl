---
title:: Monitoring AI Crawler Traffic with Prometheus and Grafana: Complete Implementation Guide
description:: Build production-grade AI crawler monitoring infrastructure using Prometheus metrics and Grafana dashboards. Tracks GPTBot, CCBot, ClaudeBot bandwidth, compliance, and anomaly detection.
focus_keyword:: Prometheus AI crawler monitoring
category:: Technical Implementation
author:: Victor Valentine Romo
date:: 2026.02.08
---

# Monitoring AI Crawler Traffic with Prometheus and Grafana: Complete Implementation Guide

**Publishers processing 500M+ AI crawler requests annually lack visibility into crawler behavior patterns, compliance violations, and infrastructure impact.** Traditional web analytics collapse crawler traffic into undifferentiated bot segments, obscuring critical intelligence about which AI companies consume your content, how aggressively they crawl, and whether they honor your robots.txt directives.

**Prometheus** and **Grafana** solve this by instrumenting crawler-specific metrics at server level and visualizing them through real-time dashboards. This guide implements production monitoring infrastructure that tracks 14 distinct AI crawler user-agents, measures bandwidth consumption per crawler, detects robots.txt violations, alerts on anomalous traffic spikes, and calculates per-crawler content targeting patterns.

Publishers operating this infrastructure surface data that informs [AI licensing deal](position-publication-ai-deal.html) negotiations, provides compliance evidence for contract enforcement, and protects server resources from abusive crawlers.

## Prometheus Fundamentals for Crawler Monitoring

**Prometheus** is an open-source metrics collection and alerting system built for instrumenting modern infrastructure. It scrapes numeric time-series data from configured endpoints, stores it in a time-series database, and exposes query language (PromQL) for analysis.

For AI crawler monitoring, Prometheus collects metrics from your web server access logs or application middleware, aggregates crawler traffic by user-agent, and makes this data queryable for Grafana visualization or alert rule evaluation.

**Core architecture components**: Prometheus server (scrapes and stores metrics), exporters (expose metrics from systems like Nginx or Apache), pushgateway (accepts metrics from batch jobs), and alertmanager (routes alerts to notification channels).

The monitoring flow: Your web server logs every HTTP request including user-agent string → Exporter process parses logs and exposes metrics at `/metrics` endpoint → Prometheus server scrapes this endpoint every 15 seconds → Metrics stored in time-series database → Grafana queries Prometheus to build visualizations.

**Metric types for crawler monitoring**: Counters (cumulative totals like total requests per crawler), gauges (current values like active crawler connections), histograms (distribution data like response time percentiles), and summaries (similar to histograms with client-side percentile calculation).

AI crawler monitoring primarily uses **counters** (request counts, bandwidth totals) and **gauges** (requests per second, concurrent crawler sessions). Histograms track response time distributions when crawler behavior impacts server performance.

**Label dimensions** segment metrics by relevant attributes. For crawler monitoring, essential labels include: `user_agent` (specific crawler identifier), `crawler_family` (OpenAI, Anthropic, Google), `http_status` (response codes), `content_type` (HTML, JSON, images), and `path_prefix` (site sections accessed).

This labeling structure enables queries like "show me GPTBot request rates for HTML content in /articles/ section returning 200 status codes" — precisely the granularity needed to understand crawler content targeting patterns.

## Infrastructure Setup: Prometheus Installation and Configuration

**Deploy Prometheus server** on dedicated infrastructure separate from your web application servers. This isolation prevents monitoring overhead from competing with application resources.

Install Prometheus via Docker for containerized deployments or via system packages for traditional server environments. Docker deployment:

```bash
docker run -d \
  --name prometheus \
  -p 9090:9090 \
  -v /opt/prometheus/config:/etc/prometheus \
  -v /opt/prometheus/data:/prometheus \
  prom/prometheus:latest \
  --config.file=/etc/prometheus/prometheus.yml \
  --storage.tsdb.retention.time=90d
```

The `--storage.tsdb.retention.time=90d` flag configures 90-day metric retention, providing sufficient historical data for trend analysis during licensing negotiations while managing disk usage.

**Configure scrape targets** in `prometheus.yml` pointing to your metrics exporters:

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'nginx-ai-crawlers'
    static_configs:
      - targets: ['web01.example.com:9113', 'web02.example.com:9113']
        labels:
          environment: 'production'

  - job_name: 'apache-ai-crawlers'
    static_configs:
      - targets: ['web03.example.com:9117']
        labels:
          environment: 'production'
```

This configuration scrapes metrics from Nginx exporters on web01/web02 and Apache exporter on web03 every 15 seconds. The `job_name` labels distinguish metric sources in queries.

**Configure recording rules** to pre-compute frequently-queried aggregations. Recording rules calculate complex queries periodically and store results as new metrics, improving dashboard query performance.

Create `/etc/prometheus/rules/ai-crawlers.yml`:

```yaml
groups:
  - name: ai_crawler_aggregations
    interval: 60s
    rules:
      - record: ai_crawler:requests:rate5m
        expr: rate(http_requests_total{user_agent=~".*Bot.*"}[5m])

      - record: ai_crawler:bandwidth:rate5m
        expr: rate(http_response_bytes_total{user_agent=~".*Bot.*"}[5m])

      - record: ai_crawler:requests_by_family:rate1h
        expr: sum by (crawler_family) (rate(http_requests_total{user_agent=~".*Bot.*"}[1h]))
```

These rules calculate 5-minute request rates, 5-minute bandwidth rates, and hourly request rates grouped by crawler family (OpenAI, Anthropic, Google). Pre-computing these aggregations reduces Grafana dashboard query latency from 2-3 seconds to under 200ms.

Reference recording rules in `prometheus.yml`:

```yaml
rule_files:
  - '/etc/prometheus/rules/ai-crawlers.yml'
```

**Configure alert rules** to notify when crawlers violate rate limits or behave anomalously. Create `/etc/prometheus/rules/ai-crawler-alerts.yml`:

```yaml
groups:
  - name: ai_crawler_alerts
    interval: 30s
    rules:
      - alert: ExcessiveCrawlerRate
        expr: rate(http_requests_total{user_agent=~".*Bot.*"}[5m]) > 100
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "AI crawler {{ $labels.user_agent }} exceeds rate limit"
          description: "{{ $labels.user_agent }} averaging {{ $value }} requests/sec for 5+ minutes"

      - alert: RobotsTxtViolation
        expr: increase(http_requests_total{user_agent=~".*Bot.*",path="/restricted/.*",http_status="403"}[1h]) > 10
        labels:
          severity: critical
        annotations:
          summary: "Crawler {{ $labels.user_agent }} violating robots.txt"
          description: "{{ $labels.user_agent }} attempted {{ $value }} requests to restricted paths in past hour"
```

The `ExcessiveCrawlerRate` alert fires when any crawler exceeds 100 requests/second for 5+ consecutive minutes. The `RobotsTxtViolation` alert triggers when crawlers attempt 10+ requests to blocked paths within an hour.

## Nginx Metrics Exporter Configuration

**Nginx metrics exporters** translate web server access logs into Prometheus metrics. Two primary approaches: **nginx-prometheus-exporter** (parses Nginx stub_status module) and **mtail** (parses access logs directly).

For comprehensive AI crawler monitoring, **mtail** provides superior detail because it accesses full request metadata including user-agents, paths, and response sizes. The stub_status approach lacks per-request granularity needed for crawler-specific metrics.

Install **mtail** on each Nginx server:

```bash
wget https://github.com/google/mtail/releases/download/v3.0.0-rc53/mtail_v3.0.0-rc53_linux_amd64
chmod +x mtail_v3.0.0-rc53_linux_amd64
mv mtail_v3.0.0-rc53_linux_amd64 /usr/local/bin/mtail
```

Create mtail program `/etc/mtail/ai-crawlers.mtail` to parse Nginx access logs and expose crawler metrics:

```mtail
counter http_requests_total by user_agent, http_status, content_type, crawler_family
counter http_response_bytes_total by user_agent, crawler_family

# Define AI crawler families
def get_crawler_family(ua) {
  /GPTBot/ { return "OpenAI" }
  /ClaudeBot/ { return "Anthropic" }
  /CCBot/ { return "CommonCrawl" }
  /Google-Extended/ { return "Google" }
  /anthropic-ai/ { return "Anthropic" }
  /Bytespider/ { return "ByteDance" }
  /Applebot-Extended/ { return "Apple" }
  /FacebookBot/ { return "Meta" }
  /cohere-ai/ { return "Cohere" }
  /PerplexityBot/ { return "Perplexity" }
  /Omgilibot/ { return "Omgili" }
  /YouBot/ { return "You.com" }
  /Diffbot/ { return "Diffbot" }
  /ImagesiftBot/ { return "Imagesift" }
  return "Other"
}

# Parse Nginx combined log format
/^/ +
/(?P<remote_addr>\S+) \S+ \S+ \[(?P<timestamp>[^\]]+)\] / +
/"(?P<method>\S+) (?P<path>\S+) \S+" / +
/(?P<status>\d{3}) (?P<bytes_sent>\d+) / +
/"(?P<referrer>[^"]*)" "(?P<user_agent>[^"]*)"/ {

  $ua = $user_agent
  $family = get_crawler_family($ua)

  # Only track AI crawler requests
  $family != "Other" {
    http_requests_total[$ua][strptime($timestamp, "02/Jan/2006:15:04:05 -0700")][int($status)]["unknown"][$family]++
    http_response_bytes_total[$ua][strptime($timestamp, "02/Jan/2006:15:04:05 -0700")][$family] += int($bytes_sent)
  }
}
```

This mtail program parses Nginx combined log format, extracts user-agent strings, maps them to crawler families (OpenAI, Anthropic, etc.), and increments request counters and bandwidth totals per crawler.

Launch mtail as systemd service. Create `/etc/systemd/system/mtail.service`:

```ini
[Unit]
Description=mtail log processor
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/bin/mtail \
  --progs /etc/mtail \
  --logs /var/log/nginx/access.log \
  --port 9113
Restart=always
User=mtail

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
useradd -r -s /bin/false mtail
systemctl enable mtail
systemctl start mtail
```

Verify metrics exposure:

```bash
curl http://localhost:9113/metrics | grep ai_crawler
```

You should see output like:

```
http_requests_total{user_agent="GPTBot/1.0",http_status="200",crawler_family="OpenAI"} 1847
http_requests_total{user_agent="ClaudeBot/1.0",http_status="200",crawler_family="Anthropic"} 923
http_response_bytes_total{user_agent="GPTBot/1.0",crawler_family="OpenAI"} 8472634
```

This confirms mtail successfully parses logs and exposes crawler-specific metrics for Prometheus scraping.

## Apache Metrics Exporter Configuration

**Apache servers** require similar log parsing but use different log format syntax. Deploy mtail with Apache-specific parsing rules.

Apache combined log format differs slightly from Nginx. Create `/etc/mtail/apache-ai-crawlers.mtail`:

```mtail
counter http_requests_total by user_agent, http_status, crawler_family
counter http_response_bytes_total by user_agent, crawler_family

def get_crawler_family(ua) {
  /GPTBot/ { return "OpenAI" }
  /ClaudeBot/ { return "Anthropic" }
  /CCBot/ { return "CommonCrawl" }
  /Google-Extended/ { return "Google" }
  /anthropic-ai/ { return "Anthropic" }
  /Bytespider/ { return "ByteDance" }
  /Applebot-Extended/ { return "Apple" }
  /FacebookBot/ { return "Meta" }
  /cohere-ai/ { return "Cohere" }
  /PerplexityBot/ { return "Perplexity" }
  return "Other"
}

# Apache combined log format
/^(?P<remote_host>\S+) \S+ \S+ \[(?P<timestamp>[^\]]+)\] / +
/"(?P<method>\S+) (?P<url>\S+) \S+" / +
/(?P<status>\d{3}) (?P<bytes_sent>\S+) / +
/"(?P<referrer>[^"]*)" "(?P<user_agent>[^"]*)"/ {

  $ua = $user_agent
  $family = get_crawler_family($ua)

  $family != "Other" {
    http_requests_total[$ua][strptime($timestamp, "02/Jan/2006:15:04:05 -0700")][int($status)][$family]++

    # Handle Apache's "-" for zero bytes
    $bytes_sent != "-" {
      http_response_bytes_total[$ua][strptime($timestamp, "02/Jan/2006:15:04:05 -0700")][$family] += int($bytes_sent)
    }
  }
}
```

Configure Apache mtail service pointing to Apache log paths:

```ini
[Service]
ExecStart=/usr/local/bin/mtail \
  --progs /etc/mtail \
  --logs /var/log/apache2/access.log \
  --port 9117
```

## Grafana Dashboard Construction

**Grafana** transforms Prometheus metrics into visual dashboards. Install Grafana via Docker or system packages:

```bash
docker run -d \
  --name grafana \
  -p 3000:3000 \
  -v /opt/grafana/data:/var/lib/grafana \
  grafana/grafana:latest
```

Access Grafana at `http://localhost:3000` (default credentials: admin/admin).

**Add Prometheus data source**: Configuration → Data Sources → Add data source → Prometheus. Configure URL pointing to your Prometheus server: `http://prometheus-server:9090`.

**Create AI Crawler Overview dashboard** with six panels:

### Panel 1: Request Rate by Crawler Family (Time Series)

This panel visualizes request volume trends across all AI crawler families over time, revealing traffic patterns and comparative crawler activity.

Query:
```promql
sum by (crawler_family) (rate(http_requests_total{user_agent=~".*Bot.*"}[5m]))
```

Visualization: Time series line chart
Legend: `{{ crawler_family }}`
Unit: requests/second

This query calculates 5-minute average request rates grouped by crawler family. The output shows separate lines for OpenAI, Anthropic, Google, etc., making traffic distribution immediately visible.

### Panel 2: Bandwidth Consumption by Crawler (Gauge)

Current bandwidth consumption rates per crawler, useful for identifying resource-intensive crawlers.

Query:
```promql
topk(10, sum by (user_agent, crawler_family) (rate(http_response_bytes_total[5m])))
```

Visualization: Bar gauge
Unit: bytes/second
Thresholds: Green (0-10MB/s), Yellow (10-50MB/s), Red (>50MB/s)

The `topk(10, ...)` function returns the 10 highest bandwidth consumers, highlighting crawlers imposing the greatest infrastructure load.

### Panel 3: Total Requests by Status Code (Stat panel)

Summary statistics showing request success rates and error distributions.

Queries:
```promql
# Total successful requests
sum(increase(http_requests_total{http_status=~"2.."}[24h]))

# Total client errors
sum(increase(http_requests_total{http_status=~"4.."}[24h]))

# Total server errors
sum(increase(http_requests_total{http_status=~"5.."}[24h]))
```

Create three stat panels displaying 24-hour request totals by status code class. Color code: Green (2xx), Orange (4xx), Red (5xx).

This panel surfaces crawler-induced error rates. High 4xx counts indicate crawlers requesting non-existent content. High 5xx counts suggest crawler traffic overwhelming server capacity.

### Panel 4: Robots.txt Violations (Table)

Detailed table listing crawlers attempting to access blocked paths, providing compliance monitoring and evidence for contract enforcement.

Query:
```promql
topk(20, sum by (user_agent, path, crawler_family) (increase(http_requests_total{path=~"/admin/.*|/api/internal/.*|/restricted/.*", http_status="403"}[24h])))
```

Visualization: Table
Columns: User Agent, Crawler Family, Path, Violation Count

This query identifies crawlers receiving 403 Forbidden responses on paths typically blocked via robots.txt. The table format makes violations easily reviewable for compliance teams or legal counsel during licensing disputes.

### Panel 5: Content Type Distribution (Pie chart)

Breakdown of what content types crawlers access most frequently — HTML pages, images, JavaScript files, etc.

Query:
```promql
sum by (content_type) (increase(http_requests_total{user_agent=~".*Bot.*"}[24h]))
```

Visualization: Pie chart
Legend: `{{ content_type }}`

This reveals crawler content targeting preferences. AI companies primarily training on text content will show 90%+ HTML requests. Those building multimodal models exhibit higher image/video request proportions.

### Panel 6: Anomaly Detection - Request Rate Spikes (Graph with annotations)

Time series highlighting abnormal traffic spikes that deviate from baseline patterns.

Query:
```promql
(
  rate(http_requests_total{user_agent=~".*Bot.*"}[5m])
  -
  avg_over_time(rate(http_requests_total{user_agent=~".*Bot.*"}[5m])[1h:5m])
) > 50
```

Visualization: Time series
Annotations: Mark points where deviation exceeds 50 requests/second above hourly average

This query calculates the difference between current request rate and 1-hour rolling average. When the difference exceeds 50 req/sec, the dashboard highlights these spikes as anomalies worthy of investigation.

Anomaly spikes indicate either crawler misbehavior (ignoring rate limits) or new crawler discovery phases (first-time comprehensive crawls of your content).

## Advanced Metrics: Per-Crawler Content Targeting Analysis

**Content targeting patterns** reveal which site sections and content types specific crawlers prioritize. This intelligence informs licensing negotiations — crawlers heavily targeting premium content justify higher licensing fees.

Implement path-prefix labeling in your mtail program to track section-level crawler behavior. Extend the mtail parsing logic:

```mtail
counter http_requests_by_section by user_agent, crawler_family, section

def get_section(path) {
  /^\/articles\// { return "articles" }
  /^\/guides\// { return "guides" }
  /^\/api-docs\// { return "api-docs" }
  /^\/blog\// { return "blog" }
  /^\/research\// { return "research" }
  return "other"
}

# In your main parsing block, add:
$section = get_section($path)
http_requests_by_section[$ua][$family][$section]++
```

Create Grafana heatmap panel showing crawler content targeting:

Query:
```promql
sum by (crawler_family, section) (increase(http_requests_by_section[24h]))
```

Visualization: Heatmap
X-axis: crawler_family
Y-axis: section
Color intensity: Request volume

This heatmap instantly reveals that OpenAI's GPTBot focuses 60% of requests on `/articles/` while Anthropic's ClaudeBot distributes requests more evenly across `/guides/` and `/research/`. These patterns inform content strategy — if `/research/` attracts disproportionate AI crawler interest, that section provides outsized licensing value.

## Bandwidth Accounting and Cost Attribution

**Bandwidth costs** from aggressive crawlers can reach $500-$5,000 monthly for high-traffic publications. Attributing these costs to specific crawlers justifies [licensing fee negotiations](position-publication-ai-deal.html) that offset infrastructure expenses.

Track bandwidth metrics with egress cost calculations. Most cloud providers charge $0.08-$0.12 per GB egress. Configure Grafana to multiply bandwidth metrics by your provider's rates.

Create calculated metric in Grafana dashboard:

Query:
```promql
sum by (crawler_family) (increase(http_response_bytes_total[30d])) * 0.09 / 1e9
```

This query calculates total bytes transferred per crawler family over 30 days, converts to gigabytes (÷ 1e9), and multiplies by $0.09/GB egress rate.

Visualization: Table
Columns: Crawler Family, Bandwidth (GB), Estimated Cost ($)

The resulting table quantifies monthly infrastructure costs attributable to each AI company's crawler. If OpenAI's GPTBot consumes 800GB generating $72 in egress costs, you possess concrete cost data supporting licensing fee negotiations.

Present this data during deal discussions: "Your crawler imposes $72 monthly in direct infrastructure costs plus server resource consumption. Our minimum licensing fee must offset these operational expenses."

## Compliance Monitoring: Detecting Robots.txt Violations

**Robots.txt compliance monitoring** detects crawlers ignoring your directives and provides evidence for contract enforcement or legal action.

Configure alerts that trigger when crawlers access blocked paths. Extend Prometheus alert rules:

```yaml
- alert: RobotsTxtSystematicViolation
  expr: |
    sum by (user_agent, crawler_family) (
      increase(http_requests_total{
        path=~"/admin/.*|/wp-admin/.*|/api/internal/.*",
        http_status="403"
      }[24h])
    ) > 50
  labels:
    severity: critical
  annotations:
    summary: "Crawler {{ $labels.user_agent }} systematically violating robots.txt"
    description: "{{ $labels.user_agent }} from {{ $labels.crawler_family }} attempted {{ $value }} blocked requests in 24h"
```

This alert fires when crawlers attempt 50+ requests to blocked paths within 24 hours, indicating systematic (not accidental) violations.

Route these alerts to your legal team or business development contacts managing AI licensing relationships. Systematic violations breach licensing agreements and justify immediate escalation.

Build a compliance evidence dashboard compiling violation history for legal proceedings:

**Compliance Report Panel**:
Query:
```promql
sum by (user_agent, crawler_family, path) (
  increase(http_requests_total{
    path=~"/admin/.*|/api/internal/.*|/restricted/.*",
    http_status="403"
  }[90d])
)
```

Visualization: Table with export functionality
Columns: Crawler, Family, Blocked Path, Violation Count, First Seen, Last Seen

Export this table to CSV for inclusion in legal demand letters or licensing renegotiation materials. The data provides timestamped evidence of specific violations with request counts and targeted paths.

## Performance Impact Analysis: Server Load Attribution

**Crawler traffic** can degrade site performance for human visitors. Measuring performance impact per crawler informs rate-limiting decisions and justifies crawler restrictions.

Track response time percentiles by crawler using histogram metrics. Extend mtail program:

```mtail
histogram http_request_duration_seconds by user_agent, crawler_family buckets 0.05, 0.1, 0.25, 0.5, 1.0, 2.5, 5.0, 10.0

# In parsing block, extract request duration from Nginx
/^(?P<remote_addr>\S+) \S+ \S+ \[(?P<timestamp>[^\]]+)\] / +
/"(?P<method>\S+) (?P<path>\S+) \S+" / +
/(?P<status>\d{3}) (?P<bytes_sent>\d+) / +
/"(?P<referrer>[^"]*)" "(?P<user_agent>[^"]*)" / +
/(?P<duration>\d+\.\d+)/ {

  $ua = $user_agent
  $family = get_crawler_family($ua)

  $family != "Other" {
    http_request_duration_seconds[$ua][$family] = float($duration)
  }
}
```

This requires configuring Nginx to log request duration. Add `$request_time` to your Nginx log format:

```nginx
log_format combined_with_duration '$remote_addr - $remote_user [$time_local] '
                                  '"$request" $status $body_bytes_sent '
                                  '"$http_referer" "$http_user_agent" $request_time';
```

Create Grafana panel comparing response times:

Query:
```promql
histogram_quantile(0.95, sum by (crawler_family, le) (rate(http_request_duration_seconds_bucket[5m])))
```

Visualization: Time series
Legend: `P95 {{ crawler_family }}`
Unit: seconds

This displays 95th percentile response times per crawler family. If ClaudeBot's p95 response time is 0.8 seconds while GPTBot's is 0.3 seconds, ClaudeBot imposes greater server load — possibly due to requesting more complex pages or overwhelming connection pools.

Correlate crawler traffic volume with overall site performance:

Query:
```promql
histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket{user_agent!~".*Bot.*"}[5m])) by (le))
```

This calculates p95 response times for human (non-bot) traffic. Overlay this with total crawler request rates to visualize performance degradation during crawler traffic spikes.

If human visitor p95 response time increases from 0.4s to 1.2s during crawler traffic spikes, crawler activity demonstrably harms user experience — justifying aggressive rate limiting or licensing fee increases to offset performance impact.

## Alert Configuration and Incident Response Workflows

**Alertmanager** routes Prometheus alerts to appropriate notification channels and manages alert lifecycle (grouping, inhibition, silencing).

Install Alertmanager:

```bash
docker run -d \
  --name alertmanager \
  -p 9093:9093 \
  -v /opt/alertmanager/config:/etc/alertmanager \
  prom/alertmanager:latest
```

Configure `/opt/alertmanager/config/alertmanager.yml`:

```yaml
global:
  resolve_timeout: 5m

route:
  group_by: ['alertname', 'crawler_family']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 4h
  receiver: 'team-infrastructure'

  routes:
    - match:
        severity: critical
      receiver: 'team-legal'

    - match:
        alertname: ExcessiveCrawlerRate
      receiver: 'team-infrastructure'

    - match:
        alertname: RobotsTxtViolation
      receiver: 'team-legal'

receivers:
  - name: 'team-infrastructure'
    slack_configs:
      - api_url: 'https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK'
        channel: '#infrastructure-alerts'
        title: 'AI Crawler Alert: {{ .GroupLabels.alertname }}'
        text: '{{ range .Alerts }}{{ .Annotations.description }}{{ end }}'

  - name: 'team-legal'
    email_configs:
      - to: 'legal@example.com'
        from: 'alerts@example.com'
        smarthost: 'smtp.example.com:587'
        auth_username: 'alerts@example.com'
        auth_password: 'smtp-password'
        headers:
          Subject: 'CRITICAL: AI Crawler Violation - {{ .GroupLabels.crawler_family }}'
```

This configuration routes infrastructure alerts (excessive rate) to your operations team via Slack while routing compliance violations to legal team via email.

Update Prometheus configuration to use Alertmanager:

```yaml
alerting:
  alertmanagers:
    - static_configs:
        - targets: ['localhost:9093']
```

**Incident response workflow** for crawler violations:

1. **Alert fires** → Alertmanager sends notification to appropriate team
2. **Team reviews** alert details including crawler identity, violation type, and magnitude
3. **For rate violations**: Implement temporary rate limiting via web server config or WAF rules
4. **For robots.txt violations**: Document evidence, compile violation history from Grafana, escalate to licensing contact at AI company
5. **Persistent violations**: Engage legal counsel, prepare demand letter citing violation evidence

Automate initial response for severe violations using Alertmanager webhook receiver triggering rate-limiting scripts. Configure webhook receiver in Alertmanager that POSTs to your infrastructure automation API when critical alerts fire, automatically applying temporary crawler blocks while your team investigates.

## Long-Term Analytics: Trend Analysis for Licensing Negotiations

**Historical trend analysis** over 90+ days reveals crawler behavior evolution and supports licensing negotiation positioning.

Create quarterly review dashboard aggregating key metrics:

**Panel: 90-Day Crawler Activity Trends**
Query:
```promql
sum by (crawler_family) (increase(http_requests_total[90d]))
```

Visualization: Bar chart
Shows total requests per crawler family over past 90 days

**Panel: Bandwidth Growth Rate**
Query:
```promql
(
  sum by (crawler_family) (increase(http_response_bytes_total[30d] offset 30d))
  /
  sum by (crawler_family) (increase(http_response_bytes_total[30d] offset 60d))
  - 1
) * 100
```

Visualization: Gauge
Shows month-over-month bandwidth growth percentage

If OpenAI's crawler bandwidth grew 85% month-over-month, they're substantially increasing their content consumption from your site. This growth justifies licensing fee increases during renewal negotiations: "Your crawler bandwidth consumption increased 85% since our initial agreement, requiring infrastructure scaling investments that warrant revised pricing."

**Panel: Content Targeting Evolution**
Query:
```promql
sum by (section) (increase(http_requests_by_section{crawler_family="OpenAI"}[7d]))
```

Visualization: Stacked area chart
Shows how crawler content targeting shifts across site sections over time

If GPTBot shifted from 40% articles / 60% documentation to 70% articles / 30% documentation over 12 weeks, OpenAI's priorities changed. This insight informs selective licensing strategies where you offer tiered pricing based on which content sections get access.

Export these trend dashboards as PDFs for inclusion in licensing negotiation materials. Visual evidence of increasing crawler activity, bandwidth consumption, and content targeting evolution substantiates your negotiating position when requesting fee increases or more favorable terms.

Publishers operating comprehensive Prometheus + Grafana monitoring infrastructure enter licensing negotiations with quantified data about crawler behavior, infrastructure costs, and content value utilization — transforming discussions from abstract speculation into evidence-based commercial negotiations.
