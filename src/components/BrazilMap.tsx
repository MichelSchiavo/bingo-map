"use client";

import React, { useState } from 'react';
import Brazil from '@svg-maps/brazil';

type StateViewerData = {
  stateCode: string;
  viewers: Array<{ id: string, viewerName: string }> ;
};

type BrazilMapProps = {
  states: StateViewerData[];
  onStateClick: (stateCode: string) => void;
};

const getStateColor = (count: number): string => {
  if (count === 0) return '#E5E7EB'; // Light gray for no viewers
  if (count < 3) return '#DBEAFE'; // Very light blue
  if (count < 6) return '#93C5FD'; // Light blue
  if (count < 10) return '#60A5FA'; // Medium blue
  if (count < 15) return '#3B82F6'; // Bright blue
  return '#2563EB'; // Strong blue for many viewers
};

const getHoverColor = (baseColor: string): string => {
  switch (baseColor) {
    case '#E5E7EB': return '#D1D5DB'; // Darker gray
    case '#DBEAFE': return '#BFDBFE'; // Darker light blue
    case '#93C5FD': return '#60A5FA'; // Darker medium blue
    case '#60A5FA': return '#3B82F6'; // Darker blue
    case '#3B82F6': return '#2563EB'; // Darker bright blue
    case '#2563EB': return '#1D4ED8'; // Darker strong blue
    default: return '#2563EB';
  }
};

const BrazilMap: React.FC<BrazilMapProps> = ({ states, onStateClick }) => {
  const [tooltip, setTooltip] = useState<{ stateCode: string; stateName: string; count: number; x: number; y: number } | null>(null);
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  
  const getStateName = (stateCode: string): string => {
    const stateNames: Record<string, string> = {
      AC: 'Acre',
      AL: 'Alagoas',
      AP: 'Amapá',
      AM: 'Amazonas',
      BA: 'Bahia',
      CE: 'Ceará',
      DF: 'Distrito Federal',
      ES: 'Espírito Santo',
      GO: 'Goiás',
      MA: 'Maranhão',
      MT: 'Mato Grosso',
      MS: 'Mato Grosso do Sul',
      MG: 'Minas Gerais',
      PA: 'Pará',
      PB: 'Paraíba',
      PR: 'Paraná',
      PE: 'Pernambuco',
      PI: 'Piauí',
      RJ: 'Rio de Janeiro',
      RN: 'Rio Grande do Norte',
      RS: 'Rio Grande do Sul',
      RO: 'Rondônia',
      RR: 'Roraima',
      SC: 'Santa Catarina',
      SP: 'São Paulo',
      SE: 'Sergipe',
      TO: 'Tocantins'
    };
    
    return stateNames[stateCode.toUpperCase()] || stateCode;
  };

  const getTooltipPosition = (x: number, y: number) => {
    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1000;
    const offset = 120;
    
    const xPos = x + offset > windowWidth ? windowWidth - offset : x;
    
    return {
      left: `${xPos}px`,
      top: `${Math.max(y - 100, 10)}px`,
    };
  };

  const handleMouseMove = (e: React.MouseEvent, stateCode: string) => {
    const stateData = states.find(s => s.stateCode === stateCode);
    const count = stateData?.viewers.length || 0;
    const stateName = getStateName(stateCode);
    
    setTooltip({
      stateCode: stateCode.toUpperCase(),
      stateName,
      count,
      x: e.clientX,
      y: e.clientY
    });
    
    setHoveredState(stateCode);
  };

  const handleMouseLeave = () => {
    setTooltip(null);
    setHoveredState(null);
  };
  
  return (
    <div className="relative w-full h-full">
      <svg viewBox={Brazil.viewBox} className="w-full h-full">
        <filter id="dropShadow" height="130%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3"/> 
          <feOffset dx="2" dy="2" result="offsetblur"/>
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.3"/>
          </feComponentTransfer>
          <feMerge> 
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/> 
          </feMerge>
        </filter>

        {Brazil.locations.map(state => {
          const stateData = states.find(s => s.stateCode === state.id);
          const viewerCount = stateData?.viewers.length || 0;
          const fillColor = getStateColor(viewerCount);
          const hoverColor = getHoverColor(fillColor);
          const isHovered = hoveredState === state.id;
          
          return (
            <path
              key={state.id}
              d={state.path}
              fill={isHovered ? hoverColor : fillColor}
              stroke="#FFFFFF"
              strokeWidth="0.5"
              filter="url(#dropShadow)"
              id={state.id}
              data-name={state.name}
              className={`transition-all duration-200 ${isHovered ? 'cursor-pointer z-10' : ''}`}
              onClick={() => onStateClick(state.id)}
              onMouseMove={(e) => handleMouseMove(e, state.id)}
              onMouseLeave={handleMouseLeave}
            />
          );
        })}
      </svg>
      
      {tooltip && (
        <div
          className="fixed bg-white dark:bg-gray-800 shadow-xl rounded-lg px-4 py-3 text-sm pointer-events-none z-50 border border-gray-200 dark:border-gray-700 max-w-[200px] w-auto"
          style={getTooltipPosition(tooltip.x, tooltip.y)}
        >
          <div className="flex items-center mb-1.5">
            <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900 flex-shrink-0 mr-2 flex items-center justify-center text-blue-800 dark:text-blue-200 text-xs font-bold">
              {tooltip.stateCode}
            </div>
            <p className="font-bold text-base truncate">{tooltip.stateName}</p>
          </div>
          
          <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <div>
              <div className="font-semibold">{tooltip.count}</div>
              <div className="text-xs text-gray-600 dark:text-gray-300">
                {tooltip.count === 1 ? 'viewer' : 'viewers'}
              </div>
            </div>
          </div>
          
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
            Clique para gerenciar viewers
          </div>
        </div>
      )}
    </div>
  );
};

export default BrazilMap;
