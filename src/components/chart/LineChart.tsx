import React from 'react';
import { LineChart } from '@mui/x-charts';

const MyLineChart: React.FC = () => {
  const data = [
    { x: 1, y: 10 },
    { x: 2, y: 15 },
    { x: 3, y: 20 },
    { x: 4, y: 25 },
    { x: 5, y: 30 },
  ];

  return (
    <div style={{ width: '100%', height: '300px' }}>
    <LineChart
      dataset={data}
      xAxis={[{ dataKey: 'x', label: 'X Axis' }]}
      series={[
        {
          dataKey: 'y',
          label: 'Series 1',
        },
      ]}
    //   width={500}
    //   height={300}
    />
    </div>
  );
};

export default MyLineChart;
