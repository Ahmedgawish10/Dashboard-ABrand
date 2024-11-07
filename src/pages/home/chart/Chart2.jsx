import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

const desktopOS = [
  { id: 'Egypt', value: 45 },
  { id: 'Palestine', value: 25 },
  { id: 'Yamein', value: 15 },
  { id: 'Syria', value: 15 },
];

// Modify the valueFormatter to receive the data context
const valueFormatter = ({ id, value }) => `${id}: ${value}%`;

export default function BasicPie() {
  return (
    <div className='!flex-1 overflow-hidden'>
      <div className='text-center text-[#a0a0a0] font-bold'>Countries with the highest purchases.</div>
      <PieChart className='  h-[100%] ml-[50px] lg:mt-[20px]'
    series={[
      {
        data: desktopOS,
        highlightScope: { fade: 'global', highlight: 'item' },
        faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
        valueFormatter, // Pass the modified formatter
      },
    ]}
     height={250}
  />
  </div>
    
  );
}
