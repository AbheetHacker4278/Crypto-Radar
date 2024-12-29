'use client'

import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTop50Cryptos } from '../services/api';
import { CryptoTable } from '../components/CryptoTable';
import { Onboarding } from '../components/Onboarding';
import { Loader2 } from 'lucide-react';
import { useWatchlist } from '../hooks/useWatchlist';
import { PerformanceWidget } from '../components/PerformanceWidget';

interface CryptoAsset {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
}

export const Home: React.FC = () => {
  const { data: assets, isLoading, error } = useQuery<CryptoAsset[]>({
    queryKey: ['top-cryptos'],
    queryFn: getTop50Cryptos,
  });

  const { watchlist } = useWatchlist();
  const [showWatchlist, setShowWatchlist] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const previousPrice = useRef<number | null>(null);

  useEffect(() => {
    if (assets?.length > 0) {
      const bitcoin = assets.find(asset => asset.id === 'bitcoin' || asset.symbol.toLowerCase() === 'btc');
      if (bitcoin && previousPrice.current !== null && bitcoin.current_price !== previousPrice.current) {
        setIsFlipping(true);
        const timer = setTimeout(() => setIsFlipping(false), 600);
        return () => clearTimeout(timer);
      }
      if (bitcoin) {
        previousPrice.current = bitcoin.current_price;
      }
    }
  }, [assets]);

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

  // const bitcoin = assets.find(asset => asset.id === 'bitcoin' || asset.symbol.toLowerCase() === 'btc');
  const filteredAssets = showWatchlist
    ? assets.filter(asset => watchlist.includes(asset.id))
    : assets;

  // Sort assets by performance
  const sortedByPerformance = [...assets].sort((a, b) => 
    b.price_change_percentage_24h - a.price_change_percentage_24h
  );

  const topPerformers = sortedByPerformance.slice(0, 5);
  const lowestPerformers = sortedByPerformance.slice(-5).reverse();

  return (
    <div className="max-w-7xl mx-auto px-4 page-transition">
      <div className="flex flex-col lg:flex-row justify-between items-start mb-8 gap-8">
        <div className="flex-1 w-full">
          <div className="flex items-center gap-6 mb-4">
            <h1 className="text-4xl font-black text-green-400">
              {showWatchlist ? 'Watchlist' : 'Top 50 Crypto Assets💸'}
            </h1>
          </div>

          <button
            onClick={() => setShowWatchlist(!showWatchlist)}
            className="px-6 py-2 border-2 border-black font-bold transition-colors hover:bg-gray-100 mb-4"
          >
            {showWatchlist ? 'Show All' : 'Show Watchlist'}
          </button>

          {filteredAssets.length > 0 ? (
            <CryptoTable assets={filteredAssets} />
          ) : (
            <div className="text-center text-gray-500 mt-4">
              No assets found {showWatchlist && 'in your watchlist'}.
            </div>
          )}
        </div>

        <div className="w-full lg:w-80">
          <PerformanceWidget topPerformers={topPerformers} lowestPerformers={lowestPerformers} />
        </div>
      </div>

      <Onboarding />
    </div>
  );
};

