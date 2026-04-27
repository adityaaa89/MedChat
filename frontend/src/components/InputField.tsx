import React from 'react'

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function InputField({ label, ...props }: InputFieldProps) {
  return (
    <div className="flex flex-col gap-1.5 sm:gap-2 w-full mb-3 sm:mb-4">
      <label className="text-xs sm:text-sm font-semibold text-slate-700">{label}</label>
      <input 
        className="px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-white border border-black/5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-pastel-clay/50 focus:border-transparent transition-all shadow-sm"
        {...props}
      />
    </div>
  )
}
