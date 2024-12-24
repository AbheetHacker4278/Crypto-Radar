import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Header } from './components/Header';
import { LatestNews } from './components/news/LatestNews';
import { Home } from './pages/Home';
import { AssetDetail } from './pages/AssetDetail';
import { Comparison } from './pages/Comparison';
import Currencyconveter from './pages/Currencyconveter';

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-100">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/asset/:id" element={<AssetDetail />} />
            <Route path="/compare" element={<Comparison />} />
            <Route path="/LatestNews" element={<LatestNews />} />
            <Route path="/currencyconveter" element={<Currencyconveter />} />
          </Routes>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;