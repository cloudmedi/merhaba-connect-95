import { YAxisProps } from "recharts";

export const commonYAxisProps: YAxisProps = {
  stroke: "#94a3b8",
  tick: { fill: '#64748b', fontSize: 12 },
  tickLine: { stroke: '#94a3b8' },
  width: 60,
  padding: { top: 20, bottom: 20 },
  tickCount: 5,
};

export const commonXAxisProps = {
  stroke: "#94a3b8",
  tick: { fill: '#64748b', fontSize: 12 },
  tickLine: { stroke: '#94a3b8' },
  width: 60,
  padding: { left: 0, right: 0 },
};

export const commonChartProps = {
  margin: { top: 20, right: 30, left: 20, bottom: 20 },
  isAnimationActive: false,
};