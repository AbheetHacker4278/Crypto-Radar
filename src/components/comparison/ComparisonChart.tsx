import React from 'react';
import { useQueries } from '@tanstack/react-query';
import { getCryptoChart } from '../../services/api';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Loader2 } from 'lucide-react';

interface Props {
  assetIds: string[];
  timeRange: string;
}

const COLORS = ['#000000', '#EAB308', '#3B82F6'];

export const ComparisonChart: React.FC<Props> = ({ assetIds, timeRange }) => {
  // Use `useQueries` for multiple asset queries
  const queries = useQueries({
    queries: assetIds.map((id) => ({
      queryKey: ['crypto-chart', id, timeRange],
      queryFn: () => getCryptoChart(id, timeRange),
    })),
  });

  // Check if any query is loading
  if (queries.some((query) => query.isLoading)) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  // Handle errors
  if (queries.some((query) => query.isError)) {
    return <div className="text-red-500">Failed to fetch chart data.</div>;
  }

  // Process chart data
  const datasets = queries.map((query, index) => ({
    data: query.data?.prices.map(([timestamp, price]: [number, number]) => ({
      dateTime: new Date(timestamp).toLocaleString(), // Include both date and time
      [`price_${index}`]: price,
    })),
    assetId: assetIds[index],
  }));

  const mergedData = datasets[0]?.data?.map((item, i) => ({
    ...item,
    ...datasets.slice(1).reduce((acc, dataset) => ({
      ...acc,
      [`price_${datasets.indexOf(dataset)}`]: dataset.data?.[i]?.[`price_${datasets.indexOf(dataset)}`],
    }), {}),
  }));

  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={mergedData}>
          <XAxis
            dataKey="dateTime"
            tickFormatter={(tick) => new Date(tick).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          />
          <YAxis />
          <Tooltip formatter={(value) => `${value}`} labelFormatter={(label) => new Date(label).toLocaleString()} />
          <Legend />
          {assetIds.map((_, index) => (
            <Line
              key={index}
              type="monotone"
              dataKey={`price_${index}`}
              stroke={COLORS[index]}
              strokeWidth={2}
              dot={false}
              name={`Asset ${index + 1}`}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
