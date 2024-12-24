import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTop50Cryptos } from '../../services/api';
import { Search, Lock } from 'lucide-react'; // Import Lock icon

interface Props {
  selectedAssets: string[];
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
}

export const ComparisonSelector: React.FC<Props> = ({
  selectedAssets,
  onSelect,
  onRemove,
}) => {
  const [search, setSearch] = React.useState('');
  const { data: assets } = useQuery({
    queryKey: ['top-cryptos'],
    queryFn: getTop50Cryptos,
  });

  const filteredAssets = assets?.filter(
    asset =>
      asset.name.toLowerCase().includes(search.toLowerCase()) ||
      asset.symbol.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mb-6">
      {/* Search Input */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search assets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border-2 border-black focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
      </div>

      {/* Asset Buttons */}
      <div className="flex flex-wrap gap-2">
        {filteredAssets?.map((asset) => {
          const isSelected = selectedAssets.includes(asset.id);
          const isDisabled =
            selectedAssets.length >= 3 && !isSelected;

          return (
            <div key={asset.id} className="relative group">
              <button
                onClick={() =>
                  isSelected
                    ? onRemove(asset.id)
                    : onSelect(asset.id)
                }
                className={`px-4 py-2 border-2 border-black font-bold transition-colors ${
                  isSelected
                    ? 'bg-green-300'
                    : 'bg-white hover:bg-gray-100'
                } ${
                  isDisabled
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
                disabled={isDisabled}
              >
                {asset.symbol.toUpperCase()}
              </button>
              {/* Show Blocked Icon on Disabled Button Hover */}
              {isDisabled && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                  <Lock className="text-white w-5 h-5" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
