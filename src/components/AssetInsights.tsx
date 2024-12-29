import React from 'react';
import { TrendingUp, Brain, Clock, Target} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface AssetInsightsProps {
  insights: {
    sentiment: string;
    supportLevel: number;
    resistanceLevel: number;
    buyingAdvice: string;
    keyFactors: string[];
  };
  isLoading: boolean;
}

const AssetInsights: React.FC<AssetInsightsProps> = ({ insights, isLoading }) => {
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-48 bg-brutal-white border-4 border-brutal-black"></div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="border-4 border-brutal-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] shadow-green-400 bg-brutal-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Market Sentiment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-mono">{insights.sentiment}</p>
        </CardContent>
      </Card>

      <Card className="border-4 border-brutal-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] shadow-green-400 bg-brutal-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Price Levels
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="font-mono">Support: ${typeof insights.supportLevel === 'number' ? insights.supportLevel.toFixed(2) : 'N/A'}</p>
          <p className="font-mono">Resistance: ${typeof insights.resistanceLevel === 'number' ? insights.resistanceLevel.toFixed(2) : 'N/A'}</p>
        </CardContent>
      </Card>

      <Card className="border-4 border-brutal-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] shadow-green-400 bg-brutal-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Buying Advice
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-mono">{insights.buyingAdvice}</p>
        </CardContent>
      </Card>
      

      <Card className="border-4 border-brutal-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] shadow-green-400 bg-brutal-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Key Factors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-1">
            {insights.keyFactors.map((factor, index) => (
              <li key={index} className="font-mono">{factor}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssetInsights;
