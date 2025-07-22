"use client";
import React from 'react';
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface Stock {
  stock: string;
  sector: string;
  presentValue: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#aa00ff', '#f30067'];

const SectorPieChart = ({ rows }: { rows: Stock[] }) => {
  const data = Object.values(
    rows.reduce((acc, stock) => {
      if (!acc[stock.sector]) {
        acc[stock.sector] = { name: stock.sector, value: 0 };
      }
      acc[stock.sector].value += stock.presentValue;
      return acc;
    }, {} as Record<string, { name: string; value: number }>)
  );

  return (
    <div className="w-full h-[400px]">
      <h2 className="text-xl font-semibold text-center mb-4">Sector-wise Portfolio</h2>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={130}
            fill="#8884d8"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SectorPieChart;
