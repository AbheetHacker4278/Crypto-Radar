import axios from 'axios';
import { NewsResponse } from '../types/news';

const BASE_URL = 'https://min-api.cryptocompare.com/data/v2';
const API_KEY = 'Your-API-Key-Here'; // Note: In production, use environment variables

export const getNewsForAsset = async (assetSymbol: string) => {
  try {
    const response = await axios.get<NewsResponse>(
      `${BASE_URL}/news/?lang=EN&categories=${assetSymbol.toLowerCase()}`,
      {
        headers: {
          'Authorization': `Apikey ${API_KEY}`
        }
      }
    );
    return response.data.Data;
  } catch (error) {
    console.error('Failed to fetch news:', error);
    return [];
  }
};