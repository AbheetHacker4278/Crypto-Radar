import axios, { AxiosError } from 'axios';

// Types
interface CryptoAsset {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_24h: number;
  image: string;
}

interface ChartData {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

interface AssetHistory {
  priceUsd: string;
  time: number;
  date: string;
}

// Cache interface
interface CacheItem<T> {
  data: T;
  timestamp: number;
}

// Constants
const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const COINCAP_API = 'https://api.coincap.io/v2';
const CACHE_DURATION = 60 * 1000; // 1 minute cache
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Cache store
const cache: { [key: string]: CacheItem<any> } = {};

// API instances with enhanced config
const coingeckoApi = axios.create({
  baseURL: COINGECKO_API,
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});

const coincapApi = axios.create({
  baseURL: COINCAP_API,
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});

// Helper function for delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generic retry function
async function withRetry<T>(
  fn: () => Promise<T>,
  retries: number = MAX_RETRIES
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0 && axios.isAxiosError(error)) {
      const status = error.response?.status;
      // Retry only on 429 (rate limit) or 5xx errors
      if (status === 429 || (status && status >= 500)) {
        await delay(RETRY_DELAY);
        return withRetry(fn, retries - 1);
      }
    }
    throw error;
  }
}

// Generic cache function
function withCache<T>(
  key: string,
  fn: () => Promise<T>,
  duration: number = CACHE_DURATION
): Promise<T> {
  const cached = cache[key];
  if (cached && Date.now() - cached.timestamp < duration) {
    return Promise.resolve(cached.data);
  }
  
  return fn().then(data => {
    cache[key] = {
      data,
      timestamp: Date.now()
    };
    return data;
  });
}

// Error handler
function handleApiError(error: unknown, context: string) {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    console.error(`${context} - Status: ${status}, Message: ${error.message}`);
    if (status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }
  }
  throw error;
}

/**
 * Fetches top 50 cryptocurrencies by market cap with caching and retries
 * @returns Promise<CryptoAsset[]>
 */
export const getTop50Cryptos = async (): Promise<CryptoAsset[]> => {
  const cacheKey = 'top50Cryptos';
  
  return withCache(cacheKey, () =>
    withRetry(async () => {
      try {
        const response = await coingeckoApi.get<CryptoAsset[]>('/coins/markets', {
          params: {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: 50,
            page: 1,
            sparkline: false
          }
        });
        return response.data;
      } catch (error) {
        handleApiError(error, 'Error fetching top cryptocurrencies');
        throw error;
      }
    })
  );
};

/**
 * Fetches historical data for a specific crypto asset with caching and retries
 * @param id - Asset identifier
 * @param interval - Time interval (e.g., 'd1' for daily)
 * @returns Promise<AssetHistory[]>
 */
export const getAssetHistory = async (
  id: string,
  interval: string = 'd1'
): Promise<AssetHistory[]> => {
  const cacheKey = `assetHistory_${id}_${interval}`;
  
  return withCache(cacheKey, () =>
    withRetry(async () => {
      try {
        const response = await coincapApi.get<{ data: AssetHistory[] }>(
          `/assets/${id}/history`,
          {
            params: { interval }
          }
        );
        return response.data.data;
      } catch (error) {
        handleApiError(error, `Error fetching history for ${id}`);
        throw error;
      }
    })
  );
};

/**
 * Fetches chart data for a specific cryptocurrency with caching and retries
 * @param id - Cryptocurrency identifier
 * @param days - Number of days of data to fetch
 * @returns Promise<ChartData>
 */
export const getCryptoChart = async (
  id: string,
  days: string
): Promise<ChartData> => {
  const cacheKey = `cryptoChart_${id}_${days}`;
  
  return withCache(cacheKey, () =>
    withRetry(async () => {
      try {
        const response = await coingeckoApi.get<ChartData>(
          `/coins/${id}/market_chart`,
          {
            params: {
              vs_currency: 'usd',
              days
            }
          }
        );
        return response.data;
      } catch (error) {
        handleApiError(error, `Error fetching chart data for ${id}`);
        throw error;
      }
    })
  );
};

// Cache cleanup function
export const clearCache = () => {
  Object.keys(cache).forEach(key => {
    if (Date.now() - cache[key].timestamp > CACHE_DURATION) {
      delete cache[key];
    }
  });
};

// Set up periodic cache cleanup
setInterval(clearCache, CACHE_DURATION);