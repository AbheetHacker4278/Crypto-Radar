import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTop50Cryptos } from '../services/api';
import { CryptoTable } from '../components/CryptoTable';
import { Onboarding } from '../components/Onboarding';
import { Loader2 } from 'lucide-react';
import { useWatchlist } from '../hooks/useWatchlist';

export const Home: React.FC = () => {
  const { data: assets, isLoading, error } = useQuery({
    queryKey: ['top-cryptos'],
    queryFn: getTop50Cryptos,
  });

  const { watchlist } = useWatchlist();
  const [showWatchlist, setShowWatchlist] = React.useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error instanceof Error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
        Failed to load crypto assets: {error.message}
      </div>
    );
  }

  if (!assets || !Array.isArray(assets)) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
        Invalid data format received from the API.
      </div>
    );
  }

  const filteredAssets = showWatchlist
    ? assets.filter(asset => watchlist.includes(asset.id))
    : assets;

  return (
    <div className="max-w-7xl mx-auto px-4 page-transition">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-black text-green-400">
          {showWatchlist ? 'Watchlist' : 'Top 50 Crypto Assets💸'}
        </h1>
        <button
          onClick={() => setShowWatchlist(!showWatchlist)}
          className="px-6 py-2 border-2 border-black font-bold transition-colors hover:bg-gray-100"
        >
          {showWatchlist ? 'Show All' : 'Show Watchlist'}
        </button>
      </div>

      {filteredAssets.length > 0 ? (
        <CryptoTable assets={filteredAssets} />
      ) : (
        <div className="text-center text-gray-500 mt-4">
          No assets found {showWatchlist && 'in your watchlist'}.
        </div>
      )}

      <Onboarding />
    </div>
  );
};
