import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { CryptoAsset } from '../types/crypto';
import { WatchlistButton } from './WatchlistButton';

interface Props {
  assets: CryptoAsset[];
}

export const CryptoTable: React.FC<Props> = ({ assets }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full overflow-x-auto bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-slide-in">
      <table className="w-full border-collapse">
        <thead className="bg-green-300 border-b-4 border-black">
          <tr>
            <th className="p-4 text-left"></th>
            <th className="p-4 text-left">#</th>
            <th className="p-4 text-left">Asset</th>
            <th className="p-4 text-right">Price</th>
            <th className="p-4 text-right">24h Change</th>
            <th className="p-4 text-right">Volume</th>
            <th className="p-4 text-right">Market Cap</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset) => (
            <tr
              key={asset.id}
              onClick={() => navigate(`/asset/${asset.id}`)}
              className="border-b border-black cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <td className="p-4">
                <WatchlistButton assetId={asset.id} />
              </td>
              <td className="p-4">{asset.market_cap_rank}</td>
              <td className="p-4 flex items-center gap-2">
                <img src={asset.image} alt={asset.name} className="w-8 h-8" />
                <span className="font-bold">{asset.name}</span>
                <span className="text-gray-500 uppercase">{asset.symbol}</span>
              </td>
              <td className="p-4 text-right">
                ${asset.current_price.toLocaleString()}
              </td>
              <td className="p-4 text-right">
                <div className="flex items-center justify-end gap-1">
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
              </td>
              <td className="p-4 text-right">
                ${asset.total_volume.toLocaleString()}
              </td>
              <td className="p-4 text-right">
                ${asset.market_cap.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};