import axios from 'axios';
import { CryptoAsset, ChartData } from '../types/crypto';

const BASE_URL = 'https://api.coingecko.com/api/v3';

export const getTop50Cryptos = async (): Promise<CryptoAsset[]> => {
  const response = await axios.get(
    `${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false`
  );
  return response.data;
};


export const getCryptoChart = async (
  id: string,
  days: string
): Promise<ChartData> => {
  const response = await axios.get(
    `${BASE_URL}/coins/${id}/market_chart?vs_currency=usd&days=${days}`
  );
  return response.data;

  
};