"use client";

import React from 'react';

const Tooltip = ({ text, children, position = 'top', align = 'center' }: { text: string; children: React.ReactNode; position?: 'top' | 'bottom'; align?: 'center' | 'left' }) => {
    const positionClasses = {
        top: 'bottom-full mb-2',
        bottom: 'top-full mt-2'
    };

    const alignClasses = {
        center: 'left-1/2 -translate-x-1/2',
        left: 'left-0'
    };

    return (
        <div className="relative flex items-center group">
          {children}
          <div className={`absolute ${alignClasses[align]} ${positionClasses[position]} w-max max-w-sm p-2 text-xs text-white bg-gray-900 border border-gray-600 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none`}>
            {text}
          </div>
        </div>
    );
};

export default Tooltip; 