export interface Stock {
  id?: number;
  stock: string;
  sector: string | null;
  purchasePrice: number;
  quantity: number;
  cmp: number;
  investment: number;
  presentValue: number;
  gainLoss: number;
  PE: number;
  latestEarnings: string;
  portfolioPercentage: string;
}
