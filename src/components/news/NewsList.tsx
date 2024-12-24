import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getNewsForAsset } from '../../services/newsApi';
import { NewsCard } from './NewsCard';
import { Loader2 } from 'lucide-react';

interface Props {
  assetSymbol?: string; // Marked as optional
}

export const NewsList: React.FC<Props> = ({ assetSymbol }) => {
  if (!assetSymbol) {
    return (
      <div className="text-center py-8 text-gray-500">
        Asset ID not provided. Please select an asset to view the news.
      </div>
    );
  }

  const {
    data: news,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['news', assetSymbol],
    queryFn: () => getNewsForAsset(assetSymbol),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin" aria-label="Loading news..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8 text-red-500">
        Error fetching news: {(error as Error).message}
      </div>
    );
  }

  if (!news?.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        No news available for this asset.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {news.map((article) => (
        <NewsCard key={article.id} article={article} />
      ))}
    </div>
  );
};
