import React from 'react';
import { Star } from 'lucide-react';
import { useWatchlist } from '../hooks/useWatchlist';

interface Props {
  assetId: string;
}

export const WatchlistButton: React.FC<Props> = ({ assetId }) => {
  const { isWatchlisted, toggleWatchlist } = useWatchlist();
  const isStarred = isWatchlisted(assetId);

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        toggleWatchlist(assetId);
      }}
      className={`p-2 border-2 border-black transition-transform hover:scale-110 ${
        isStarred ? 'bg-green-300' : 'bg-white hover:bg-gray-100'
      }`}
    >
      <Star className={`w-5 h-5 ${isStarred ? 'fill-current' : ''}`} />
    </button>
  );
};