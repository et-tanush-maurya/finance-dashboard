import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const COLORS = ['#4A90A4', '#5BA88A', '#D4915E', '#8B7BB5', '#C96B6B', '#6B9AC4', '#9B8A7B', '#7BA88A'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 p-3 shadow-lg">
        <p className="text-sm font-medium text-gray-900">{payload[0].payload.displayName}</p>
        <p className="text-sm text-gray-600">
          {payload[0].payload.percentage}%
        </p>
      </div>
    );
  }
  return null;
};

const renderLegend = (props) => {
  const { payload } = props;
  return (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-4">
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-1.5">
          <div 
            className="w-2.5 h-2.5" 
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs text-gray-600">{entry.payload.displayName}</span>
        </div>
      ))}
    </div>
  );
};

export default function ModulePieChart({ data, title }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      {title && (
        <h3 className="text-base font-bold text-gray-900 mb-6">
          {title}
        </h3>
      )}
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={50}
              outerRadius={85}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={renderLegend} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}