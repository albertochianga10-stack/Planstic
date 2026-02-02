
export enum DemandLevel {
  LOW = 'Baixa',
  MEDIUM = 'Média',
  HIGH = 'Alta'
}

export enum TrendDirection {
  UP = 'Subindo',
  STABLE = 'Estável',
  DOWN = 'Caindo'
}

export interface ProductTrend {
  id: string;
  name: string;
  category: string;
  demandLevel: DemandLevel;
  trend: TrendDirection;
  growthPercentage: number;
  keywords: string[];
  opportunityScore: number;
  reasoning: string;
  history: { date: string; value: number }[];
}

export interface MarketAnalysisResponse {
  trends: ProductTrend[];
  marketOverview: string;
  topOpportunities: string[];
}
