import React from 'react';
import { NewsArticle } from '../../types/news';
import { Calendar } from 'lucide-react';

interface Props {
  article: NewsArticle;
}

export const NewsCard: React.FC<Props> = ({ article }) => {
  // Use fallback values for missing data
  const title = article.title || 'Untitled';
  const body = article.body || 'No description available.';
  const imageurl = article.imageurl || null;
  const source = article.source || 'Unknown Source';
  const date = article.published_on
    ? new Date(article.published_on * 1000).toLocaleDateString()
    : 'Unknown Date';

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white border-2 border-black p-4 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow"
    >
      {imageurl ? (
        <img
          src={imageurl}
          alt={title}
          loading="lazy"
          className="w-full h-48 object-cover mb-4 border border-black"
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center mb-4 border border-black">
          <span className="text-gray-500">No Image Available</span>
        </div>
      )}
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-gray-600 mb-4 line-clamp-2">{body}</p>
      <div className="flex items-center justify-between text-sm">
        <span className="bg-green-300 px-2 py-1 border border-black">
          {source}
        </span>
        <div className="flex items-center gap-1 text-gray-500">
          <Calendar className="w-4 h-4" />
          {date}
        </div>
      </div>
    </a>
  );
};
