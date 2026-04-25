import React from 'react'

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function InputField({ label, ...props }: InputFieldProps) {
  return (
    <div className="flex flex-col gap-2 w-full mb-4">
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      <input 
        className="px-4 py-3 rounded-xl bg-white border border-black/5 focus:outline-none focus:ring-2 focus:ring-pastel-clay/50 focus:border-transparent transition-all shadow-sm"
        {...props}
      />
    </div>
  )
}
