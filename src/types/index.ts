export type MusicRecord = {
  Format: string;
  Metric: string;
  Year: number;
  'Value(Actual)': number;
};

export type DashboardKPIs = {
  totalRevenue: number;
  streamingShare: number;
  vinylUnits: number;
};