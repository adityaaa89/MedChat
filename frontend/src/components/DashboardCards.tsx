import HealthCard from './HealthCard'
import { Activity, Droplet, User, Ruler, Weight, AlertCircle } from 'lucide-react'

export default function DashboardCards({ profile, isDemo }: { profile: any, isDemo: boolean }) {
  const data = isDemo ? {
    age: '--', height: '--', weight: '--', blood_group: '--'
  } : profile || {}

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4">
        <HealthCard title="Age" value={data.age || '--'} icon={<User className="w-5 h-5 text-pastel-teal" />} bgColor="bg-cream-100" borderColor="border-t-slate-200" />
        <HealthCard title="Blood Group" value={data.blood_group || '--'} icon={<Droplet className="w-5 h-5 text-pastel-teal" />} bgColor="bg-pastel-blue" borderColor="border-t-pastel-blue_border" />
        <HealthCard title="Height" value={data.height || '--'} icon={<Ruler className="w-5 h-5 text-pastel-teal" />} bgColor="bg-pastel-sage" borderColor="border-t-pastel-sage_border" />
        <HealthCard title="Weight" value={data.weight || '--'} unit="kg" icon={<Weight className="w-5 h-5 text-pastel-teal" />} bgColor="bg-pastel-lavender" borderColor="border-t-pastel-lavender_border" />
      </div>

      <div className="p-6 rounded-[24px] bg-cream-100 border border-black/5 shadow-sm mt-2 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-[3px] bg-pastel-clay/40"></div>
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-pastel-clay" /> Medical History
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-white/50 border border-black/5">
            <p className="text-sm font-semibold text-slate-500 mb-1">Chronic Diseases</p>
            <p className="text-base text-slate-800 font-medium">{data.disease || 'None reported'}</p>
          </div>
          <div className="p-4 rounded-xl bg-white/50 border border-black/5">
            <p className="text-sm font-semibold text-slate-500 mb-1">Allergies</p>
            <p className="text-base text-slate-800 font-medium">{data.allergies || 'None reported'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <HealthCard title="Blood Pressure" value="120/80" unit="mmHg" icon={<Activity className="w-5 h-5 text-pastel-teal" />} trend="-2%" trendUp={true} bgColor="bg-[#FDF6E3]" borderColor="border-t-[#EBE2CA]" />
        <HealthCard title="Oxygen Level" value="98" unit="%" icon={<Droplet className="w-5 h-5 text-pastel-teal" />} bgColor="bg-cream-100" borderColor="border-t-slate-200" />
      </div>
    </div>
  )
}
