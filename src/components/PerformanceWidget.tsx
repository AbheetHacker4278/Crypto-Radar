'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, ChevronUp, ChevronDown } from 'lucide-react';

interface CryptoAsset {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
}

interface PerformanceWidgetProps {
  topPerformers: CryptoAsset[];
  lowestPerformers: CryptoAsset[];
}

export const PerformanceWidget: React.FC<PerformanceWidgetProps> = ({ topPerformers, lowestPerformers }) => {
  const [showTop, setShowTop] = useState(true);

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden mt-28">
      <div className="flex justify-between items-center p-4 bg-gray-50">
        <h2 className="text-lg font-bold">Performance</h2>
        <button
          onClick={() => setShowTop(!showTop)}
          className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          {showTop ? (
            <>
              Top <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              Lowest <ChevronDown className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={showTop ? 'top' : 'lowest'}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <ul className="divide-y divide-gray-200">
            {(showTop ? topPerformers : lowestPerformers).map((asset) => (
              <li key={asset.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{asset.symbol.toUpperCase()}</span>
                    <span className="text-sm text-gray-500">{asset.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold ${asset.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {asset.price_change_percentage_24h.toFixed(2)}%
                    </span>
                    {asset.price_change_percentage_24h >= 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  ${asset.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </li>
            ))}
          </ul>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

