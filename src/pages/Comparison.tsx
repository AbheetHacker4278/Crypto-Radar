import React from 'react';
import { ComparisonSelector } from '../components/comparison/ComparisonSelector';
import { ComparisonChart } from '../components/comparison/ComparisonChart';
import { ComparisonMetrics } from '../components/comparison/ComparisonMetrics';

const timeRanges = [
  { label: '1D', value: '1' },
  { label: '7D', value: '7' },
  { label: '1M', value: '30' },
  { label: '1Y', value: '365' },
];

export const Comparison: React.FC = () => {
  const [selectedAssets, setSelectedAssets] = React.useState<string[]>([]);
  const [timeRange, setTimeRange] = React.useState('7');

  const handleSelect = (id: string) => {
    if (selectedAssets.length < 3) {
      setSelectedAssets([...selectedAssets, id]);
    }
  };

  const handleRemove = (id: string) => {
    setSelectedAssets(selectedAssets.filter(assetId => assetId !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 page-transition">
      <h1 className="text-4xl font-black mb-8">Compare Assets</h1>

      <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-slide-in">
        <ComparisonSelector
          selectedAssets={selectedAssets}
          onSelect={handleSelect}
          onRemove={handleRemove}
        />

        {selectedAssets.length > 0 && (
          <>
            <ComparisonMetrics assetIds={selectedAssets} />

            <div className="flex gap-4 mb-6">
              {timeRanges.map((range) => (
                <button
                  key={range.value}
                  onClick={() => setTimeRange(range.value)}
                  className={`px-4 py-2 border-2 border-black font-bold transition-colors ${
                    timeRange === range.value
                      ? 'bg-green-300'
                      : 'bg-white hover:bg-gray-100'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>

            <ComparisonChart
              assetIds={selectedAssets}
              timeRange={timeRange}
            />
          </>
        )}
      </div>
    </div>
  );
};