import React, { useState } from 'react';
import { NewsList } from './NewsList'; // Import the NewsList component
import { Loader2 } from 'lucide-react';

export const LatestNews: React.FC = () => {
  const [assetSymbol, setAssetSymbol] = useState<string>('BTC'); // Default to BTC
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const handleAssetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAssetSymbol(event.target.value);
  };

  const fetchNews = () => {
    if (!assetSymbol) {
      alert('Please enter an asset symbol.');
      return;
    }
    setIsFetching(true);
    setTimeout(() => setIsFetching(false), 500); // Simulates a fetch state
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Crypto News</h1>

      {/* Asset Selection Input */}
      <div className="flex justify-center items-center gap-4 mb-8">
        <input
          type="text"
          placeholder="Enter asset symbol (e.g., BTC)"
          value={assetSymbol}
          onChange={handleAssetChange}
          className="border border-black p-2 w-64"
        />
        <button
          onClick={fetchNews}
          className="bg-black text-white px-4 py-2 border-2 border-black hover:bg-white hover:text-black transition"
        >
          Fetch News
        </button>
      </div>

      {/* Show Loader While Fetching */}
      {isFetching ? (
        <div className="flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : (
        // News List for the Provided Asset
        <NewsList assetSymbol={assetSymbol} />
      )}
    </div>
  );
};

export default LatestNews;
