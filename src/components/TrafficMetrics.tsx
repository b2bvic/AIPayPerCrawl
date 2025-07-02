import React from 'react';

interface TrafficData {
  estimatedMonthlyVisits?: number;
  globalRank?: number;
  confidence: 'high' | 'medium' | 'low' | 'estimated' | 'unknown';
  dataSource: string;
}

interface TrafficMetricsProps {
  domain: string;
  trafficData?: TrafficData;
  showDetails?: boolean;
  className?: string;
}

const TrafficMetrics: React.FC<TrafficMetricsProps> = ({
  domain,
  trafficData,
  showDetails = false,
  className = ''
}) => {
  if (!trafficData) {
    return (
      <div className={`text-gray-500 text-sm ${className}`}>
        <span className="inline-flex items-center">
          <span className="w-2 h-2 bg-gray-300 rounded-full mr-2"></span>
          Traffic data unavailable
        </span>
      </div>
    );
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toLocaleString();
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high':
        return 'bg-green-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-orange-500';
      case 'estimated':
        return 'bg-blue-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getConfidenceText = (confidence: string) => {
    switch (confidence) {
      case 'high':
        return 'High accuracy';
      case 'medium':
        return 'Medium accuracy';
      case 'low':
        return 'Low accuracy';
      case 'estimated':
        return 'Estimated';
      default:
        return 'Unknown accuracy';
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Monthly Visits */}
      {trafficData.estimatedMonthlyVisits && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Monthly Visits:</span>
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-gray-900">
              {formatNumber(trafficData.estimatedMonthlyVisits)}
            </span>
            <div
              className={`w-2 h-2 rounded-full ${getConfidenceColor(trafficData.confidence)}`}
              title={getConfidenceText(trafficData.confidence)}
            ></div>
          </div>
        </div>
      )}

      {/* Global Rank */}
      {trafficData.globalRank && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Global Rank:</span>
          <span className="font-semibold text-gray-900">
            #{trafficData.globalRank.toLocaleString()}
          </span>
        </div>
      )}

      {/* Detailed Information */}
      {showDetails && (
        <div className="pt-2 border-t border-gray-200 space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Data Source:</span>
            <span className="text-gray-700 capitalize">{trafficData.dataSource}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Confidence:</span>
            <span className={`px-2 py-1 rounded-full text-white text-xs ${getConfidenceColor(trafficData.confidence)}`}>
              {getConfidenceText(trafficData.confidence)}
            </span>
          </div>
        </div>
      )}

      {/* Compact View */}
      {!showDetails && trafficData.estimatedMonthlyVisits && (
        <div className="text-xs text-gray-500">
          {formatNumber(trafficData.estimatedMonthlyVisits)} monthly visits
          <span className={`inline-block w-1.5 h-1.5 rounded-full ml-1 ${getConfidenceColor(trafficData.confidence)}`}></span>
        </div>
      )}
    </div>
  );
};

export default TrafficMetrics;

// Hook for fetching traffic data
export const useTrafficData = (domain: string) => {
  const [trafficData, setTrafficData] = React.useState<TrafficData | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!domain) return;

    const fetchTrafficData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/traffic?domain=${encodeURIComponent(domain)}`);
        const result = await response.json();

        if (result.success && result.data) {
          setTrafficData({
            estimatedMonthlyVisits: result.data.estimated_monthly_visits,
            globalRank: result.data.global_rank,
            confidence: result.data.confidence,
            dataSource: result.data.data_source
          });
        } else {
          setError('Failed to fetch traffic data');
        }
      } catch (err) {
        setError('Network error');
        console.error('Traffic data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrafficData();
  }, [domain]);

  return { trafficData, loading, error };
};

// Batch traffic data hook
export const useBatchTrafficData = (domains: string[]) => {
  const [trafficDataMap, setTrafficDataMap] = React.useState<Record<string, TrafficData>>({});
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!domains || domains.length === 0) return;

    const fetchBatchTrafficData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/traffic', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ domains })
        });

        const result = await response.json();

        if (result.success && result.data && result.data.domains) {
          const dataMap: Record<string, TrafficData> = {};
          
          for (const [domain, data] of Object.entries(result.data.domains)) {
            const typedData = data as any;
            dataMap[domain] = {
              estimatedMonthlyVisits: typedData.estimated_monthly_visits,
              globalRank: typedData.global_rank,
              confidence: typedData.confidence,
              dataSource: typedData.data_source
            };
          }
          
          setTrafficDataMap(dataMap);
        } else {
          setError('Failed to fetch batch traffic data');
        }
      } catch (err) {
        setError('Network error');
        console.error('Batch traffic data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBatchTrafficData();
  }, [domains.join(',')]); // Re-run when domains array changes

  return { trafficDataMap, loading, error };
}; 