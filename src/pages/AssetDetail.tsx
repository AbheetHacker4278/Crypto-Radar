import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCryptoChart, getTop50Cryptos } from '../services/api';
import { WatchlistButton } from '../components/WatchlistButton';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Loader2 } from 'lucide-react';

const timeRanges = [
  { label: '1D', value: '1' },
  { label: '7D', value: '7' },
  { label: '1M', value: '30' },
  { label: '1Y', value: '365' },
];

const fetchInrRate = async () => {
  const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
  const data = await response.json();
  return data.rates.INR;
};

export const AssetDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [timeRange, setTimeRange] = React.useState('7');

  const { data: chartData, isLoading: isChartLoading } = useQuery({
    queryKey: ['crypto-chart', id, timeRange],
    queryFn: () => getCryptoChart(id!, timeRange),
  });

  const { data: assets, isLoading: isAssetsLoading } = useQuery({
    queryKey: ['top-cryptos'],
    queryFn: getTop50Cryptos,
  });

  const { data: inrRate, isLoading: isInrRateLoading } = useQuery({
    queryKey: ['usd-to-inr'],
    queryFn: fetchInrRate,
  });

  const asset = assets?.find((asset) => asset.id === id);

  if (isChartLoading || isAssetsLoading || isInrRateLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const formattedData = chartData?.prices.map(([timestamp, price]) => ({
    dateTime: new Date(timestamp).toLocaleString(),
    price,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <div className="flex items-center gap-2">
            <img src={asset?.image} alt="logo" className="w-6 h-6 rounded-full" />
            <p className="text-sm font-medium">{asset?.name}</p>
          </div>
          <p className="text-sm">Time: {new Date(payload[0].payload.dateTime).toLocaleString()}</p>
          <p className="text-sm">Price: ${payload[0].value.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  const allTimeHigh = asset?.ath || 0;
  const allTimeHighInInr = allTimeHigh * (inrRate || 0);
  const marketCapInInr = (asset?.market_cap || 0) * (inrRate || 0);
  const totalVolumeInInr = (asset?.total_volume || 0) * (inrRate || 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 page-transition">
      <div className="bg-gradient-to-r from-white to-white border rounded-xl shadow-lg p-6 animate-slide-in">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            {timeRanges.map((range) => (
              <button
                key={range.value}
                onClick={() => setTimeRange(range.value)}
                className={`px-4 py-2 border rounded-lg font-bold text-sm transition-all ${
                  timeRange === range.value
                    ? 'bg-green-500 text-white'
                    : 'bg-white hover:bg-gray-100'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
          {id && <WatchlistButton assetId={id} />}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {asset?.image && (
            <div className="flex flex-col items-center bg-white shadow-lg hover:shadow-green-300 rounded-xl p-6 transition transform hover:scale-105 hover:shadow-2xl">
              <img
                src={asset.image}
                alt={`${asset.name} logo`}
                className="w-20 h-20 rounded-full mb-4 object-cover border-4 border-indigo-500/50"
              />
              <h2 className="text-xl font-semibold text-gray-800 mb-1">{asset?.name}</h2>
              <span className="text-gray-400 uppercase tracking-wide">({asset?.symbol})</span>
            </div>
          )}
          <div className="bg-white shadow-lg rounded-xl p-6 transition transform hover:scale-105 hover:shadow-2xl hover:shadow-green-300">
            <strong className="text-gray-700">Market Cap:</strong>
            <p className="text-lg font-medium text-gray-900">${asset?.market_cap?.toLocaleString()} | ₹{marketCapInInr.toLocaleString()}</p>
          </div>
          <div className="bg-white shadow-lg rounded-xl p-6 transition transform hover:scale-105 hover:shadow-2xl hover:shadow-green-300">
            <strong className="text-gray-700">Total Volume:</strong>
            <p className="text-lg font-medium text-gray-900">${asset?.total_volume?.toLocaleString()} | ₹{totalVolumeInInr.toLocaleString()}</p>
          </div>
          <div className="bg-white shadow-lg rounded-xl p-6 transition transform hover:scale-105 hover:shadow-2xl hover:shadow-green-300">
            <strong className="text-gray-700">All-Time High:</strong>
            <p className="text-lg font-medium text-gray-900">${allTimeHigh.toLocaleString()} | ₹{allTimeHighInInr.toLocaleString()}</p>
          </div>
        </div>


        <div className="h-[400px] bg-white rounded-lg shadow-md p-4 animate-fade-in hover:shadow-green-300">
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedData} className='hover:shadow-green-300'>
              <XAxis dataKey="dateTime" tickFormatter={(tick) => new Date(tick).toLocaleString()} />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="price" className='hover:shadow-green-300' stroke="green" strokeWidth={2} dot={false} />
            </LineChart>
        </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
