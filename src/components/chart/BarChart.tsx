import * as React from 'react';
import { BarChart as MuiBarChart, BarChartProps } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { dataset } from './data';

// Define the chart settings
const chartSetting = {
  yAxis: [
    {
      label: 'rainfall (mm)',
    },
  ],
//   width: 500,
//   height: 300,
  sx: {
    [`.${axisClasses.left} .${axisClasses.label}`]: {
      transform: 'translate(-10px, 0)',
    },
  },
};

// Define the value formatter
const valueFormatter = (value: number | null) => `${value}mm`;

type DatasetType = {
  month: string;
  london: number;
  paris: number;
  newYork: number;
  seoul: number;
};

// Cast the dataset to the expected type
const typedDataset: DatasetType[] = dataset;

export default function BarChart() {
  // Define the props for BarChart
  const barChartProps: BarChartProps = {
    dataset: typedDataset,
    xAxis: [{ scaleType: 'band', dataKey: 'month' }],
    series: [
      { dataKey: 'london', label: 'London', valueFormatter },
      { dataKey: 'paris', label: 'Paris', valueFormatter },
      { dataKey: 'newYork', label: 'New York', valueFormatter },
      { dataKey: 'seoul', label: 'Seoul', valueFormatter },
    ],
    ...chartSetting,
  };

  return (
    <div style={{ width: '100%', height: '300px' }}>
      <MuiBarChart {...barChartProps} />
    </div>
  );
}
