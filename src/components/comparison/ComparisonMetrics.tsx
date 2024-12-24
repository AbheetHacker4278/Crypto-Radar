import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTop50Cryptos } from '../../services/api';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

interface Props {
  assetIds: string[];
}

export const ComparisonMetrics: React.FC<Props> = ({ assetIds }) => {
  const { data: assets } = useQuery({
    queryKey: ['top-cryptos'],
    queryFn: getTop50Cryptos,
  });

  const selectedAssets = assets?.filter(asset => assetIds.includes(asset.id)) || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {selectedAssets.map((asset) => (
        <div
          key={asset.id}
          className="bg-white border-2 border-black p-4"
        >
          <div className="flex items-center gap-2 mb-4">
            <img src={asset.image} alt={asset.name} className="w-8 h-8" />
            <span className="font-bold">{asset.name}</span>
            <span className="text-gray-500 uppercase">({asset.symbol})</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Price:</span>
              <span className="font-bold">${asset.current_price.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">24h Change:</span>
              <div className="flex items-center gap-1">
                {asset.price_change_percentage_24h > 0 ? (
                  <ArrowUpCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <ArrowDownCircle className="w-4 h-4 text-red-500" />
                )}
                <span
                  className={
                    asset.price_change_percentage_24h > 0
                      ? 'text-green-500'
                      : 'text-red-500'
                  }
                >
                  {Math.abs(asset.price_change_percentage_24h).toFixed(2)}%
                </span>
              </div>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Market Cap:</span>
              <span className="font-bold">${asset.market_cap.toLocaleString()}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Volume:</span>
              <span className="font-bold">${asset.total_volume.toLocaleString()}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};