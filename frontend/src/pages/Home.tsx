import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import DashboardCards from '../components/DashboardCards'
import Chatbot from '../components/Chatbot'
import { Loader2 } from 'lucide-react'

export default function Home() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState('User')
  
  const location = useLocation()
  const navigate = useNavigate()
  const isDemo = location.state?.demo === true

  useEffect(() => {
    if (isDemo) {
      setUserName('Demo User')
      setLoading(false)
      return
    }

    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        navigate('/login')
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error(error)
        // Profile not found, force onboarding
        navigate('/onboarding')
      } else {
        setProfile(data)
        setUserName(data.name || 'User')
      }
      setLoading(false)
    }

    fetchProfile()
  }, [isDemo, navigate])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-80px)]">
        <Loader2 className="w-8 h-8 animate-spin text-pastel-teal" />
      </div>
    )
  }

  return (
    <div className="flex-1 p-6 lg:p-8 h-full">
      <div className="grid lg:grid-cols-2 gap-8 h-full">
        {/* Left Side: Health Dashboard */}
        <div className="flex flex-col h-full overflow-y-auto pr-4 scrollbar-hide">
          <div className="mb-8">
            <h1 className="text-4xl font-extrabold text-slate-800 mb-2 tracking-tight">
              Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}, <span className="text-pastel-clay">{userName}</span>
            </h1>
            <p className="text-slate-500 text-lg">Here's your health overview for today.</p>
          </div>
          
          <DashboardCards profile={profile} isDemo={isDemo} />
        </div>

        {/* Right Side: Chatbot */}
        <div className="h-[calc(100vh-140px)] min-h-[500px]">
          <Chatbot isDemo={isDemo} />
        </div>
      </div>
    </div>
  )
}
