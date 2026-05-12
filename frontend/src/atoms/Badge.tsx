import React from 'react';

type Color = 'gray' | 'green' | 'yellow' | 'red' | 'blue' | 'purple' | 'indigo';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: Color | string;
}

const colorClasses: Record<Color, string> = {
  gray: 'bg-gray-100 text-gray-700',
  green: 'bg-green-100 text-green-700',
  yellow: 'bg-yellow-100 text-yellow-700',
  red: 'bg-red-100 text-red-700',
  blue: 'bg-blue-100 text-blue-700',
  purple: 'bg-purple-100 text-purple-700',
  indigo: 'bg-indigo-100 text-indigo-700',
};

export const Badge: React.FC<BadgeProps> = ({ children, color = 'gray', className = '', ...props }) => {
  const colorClass = (color && color in colorClasses) ? colorClasses[color as Color] : colorClasses.gray;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
