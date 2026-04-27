import React from 'react'

interface HealthCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  bgColor?: string;
  borderColor?: string;
}

export default function HealthCard({ title, value, unit, icon, trend, trendUp, bgColor = 'bg-cream-100', borderColor = 'border-transparent' }: HealthCardProps) {
  return (
    <div className={`p-4 sm:p-6 rounded-[20px] sm:rounded-[24px] ${bgColor} border border-black/5 border-t-[3px] ${borderColor} shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md`}>
      <div className="flex justify-between items-start mb-4 sm:mb-6">
        <div className="p-2 sm:p-2.5 bg-white/70 rounded-lg sm:rounded-xl text-slate-800 backdrop-blur-sm shadow-sm">
          {icon}
        </div>
        {trend && (
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${trendUp ? 'bg-pastel-sage/50 text-slate-800' : 'bg-pastel-clay/30 text-slate-800'}`}>
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-slate-600 font-semibold text-xs sm:text-sm mb-1">{title}</p>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
          {value} {unit && <span className="text-base sm:text-lg text-slate-500 font-medium">{unit}</span>}
        </h3>
      </div>
    </div>
  )
}
