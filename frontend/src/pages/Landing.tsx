import { Link, useNavigate } from 'react-router-dom'
import { HeartPulse, MessageSquare, ShieldCheck, ArrowRight } from 'lucide-react'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
      <div className="text-center max-w-3xl mx-auto mb-20">
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-800 tracking-tight mb-6">
          Your Personal <span className="text-pastel-clay">Health Assistant</span>
        </h1>
        <p className="text-xl text-slate-500 mb-10 leading-relaxed">
          Monitor your vitals, get personalized insights, and chat with an intelligent AI that understands your health profile. All in one beautiful dashboard.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/signup" className="px-8 py-4 rounded-full bg-pastel-teal text-white font-semibold text-lg shadow-sm hover:shadow-md hover:bg-pastel-teal_hover transition-all duration-200 flex items-center justify-center gap-2">
            Get Started <ArrowRight className="w-5 h-5" />
          </Link>
          <button onClick={() => navigate('/home', { state: { demo: true } })} className="px-8 py-4 rounded-full bg-pastel-sage_btn text-white font-semibold text-lg shadow-sm hover:shadow-md hover:bg-pastel-sage_btn_hover transition-all duration-200 border-none">
            Try Demo
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <FeatureCard 
          icon={<MessageSquare className="w-8 h-8 text-pastel-teal" />}
          title="Smart Chatbot"
          description="Ask medical questions and receive accurate, tailored advice instantly."
          bgColor="bg-pastel-blue"
          borderColor="border-pastel-blue_border"
        />
        <FeatureCard 
          icon={<HeartPulse className="w-8 h-8 text-pastel-teal" />}
          title="Health Tracking"
          description="Keep all your vitals in check with our beautifully designed dashboard."
          bgColor="bg-pastel-sage"
          borderColor="border-pastel-sage_border"
        />
        <FeatureCard 
          icon={<ShieldCheck className="w-8 h-8 text-pastel-teal" />}
          title="Personalized Insights"
          description="Receive tailored recommendations based on your unique health profile."
          bgColor="bg-pastel-lavender"
          borderColor="border-pastel-lavender_border"
        />
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, description, bgColor, borderColor }: { icon: React.ReactNode, title: string, description: string, bgColor: string, borderColor: string }) {
  return (
    <div className={`p-8 rounded-[24px] ${bgColor} border ${borderColor} shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200`}>
      <div className="w-16 h-16 rounded-2xl bg-white/80 shadow-sm flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-slate-800 mb-3 tracking-tight">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  )
}
