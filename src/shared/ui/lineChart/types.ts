export interface WeeklyChartData {
  dailyBreakdown?: Record<string, number>;
  averageMinutes?: number;
}

export type TProps = {
  width: number;
  height: number;
  data?: WeeklyChartData;
};

export type ChartRef = {
  animate: (forward?: boolean) => void;
};
