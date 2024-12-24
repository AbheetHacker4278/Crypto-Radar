import React, { useState, useEffect } from 'react';

const CurrencyConverter = () => {
  const [cryptos, setCryptos] = useState<any[]>([]); // Store cryptocurrency list
  const [fromCrypto, setFromCrypto] = useState<string>('bitcoin'); // Default from crypto
  const [toCrypto, setToCrypto] = useState<string>('ethereum'); // Default to crypto
  const [amount, setAmount] = useState<number>(1); // Amount to convert
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null); // Converted amount
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fetch cryptocurrency list from CoinGecko API
  useEffect(() => {
    const fetchCryptos = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd');
        const data = await response.json();
        setCryptos(data);
      } catch (error) {
        console.error('Error fetching crypto data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCryptos();
  }, []);

  // Fetch conversion rate between two selected cryptocurrencies
  const fetchConversionRate = async () => {
    if (!fromCrypto || !toCrypto || fromCrypto === toCrypto) {
      setConvertedAmount(amount);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${fromCrypto},${toCrypto}&vs_currencies=usd`);
      const data = await response.json();

      const fromPrice = data[fromCrypto]?.usd || 0;
      const toPrice = data[toCrypto]?.usd || 0;

      const conversionRate = fromPrice / toPrice;
      setConvertedAmount(amount * conversionRate);
    } catch (error) {
      console.error('Error fetching conversion rate:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submission
  const handleConvert = (e: React.FormEvent) => {
    e.preventDefault();
    fetchConversionRate();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">Crypto Currency Converter</h2>

      <form onSubmit={handleConvert} className="space-y-4">
        <div>
          <label htmlFor="fromCrypto" className="block text-sm font-medium text-gray-700">From Cryptocurrency</label>
          <select
            id="fromCrypto"
            name="fromCrypto"
            value={fromCrypto}
            onChange={(e) => setFromCrypto(e.target.value)}
            className="mt-2 p-2 border border-gray-300 rounded-md w-full"
          >
            {cryptos.map((crypto) => (
              <option key={crypto.id} value={crypto.id}>
                {crypto.name} ({crypto.symbol.toUpperCase()})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="toCrypto" className="block text-sm font-medium text-gray-700">To Cryptocurrency</label>
          <select
            id="toCrypto"
            name="toCrypto"
            value={toCrypto}
            onChange={(e) => setToCrypto(e.target.value)}
            className="mt-2 p-2 border border-gray-300 rounded-md w-full"
          >
            {cryptos.map((crypto) => (
              <option key={crypto.id} value={crypto.id}>
                {crypto.name} ({crypto.symbol.toUpperCase()})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
            className="mt-2 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>

        <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600">
          Convert
        </button>
      </form>

      {isLoading && <div className="mt-4 text-center">Loading...</div>}

      {convertedAmount !== null && !isLoading && (
        <div className="mt-4">
          <h3 className="font-bold">Conversion Result:</h3>
          <p>
            <span className="font-bold">{amount}</span> {fromCrypto} is equal to <span className="font-bold">{convertedAmount.toFixed(4)}</span> {toCrypto}.
          </p>
        </div>
      )}
    </div>
  );
};

export default CurrencyConverter;
