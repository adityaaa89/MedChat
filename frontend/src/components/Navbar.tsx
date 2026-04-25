import { Link, useNavigate } from 'react-router-dom'
import { Activity } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <nav className="w-full px-6 py-4 border border-[#E5D6C5] bg-cream-100 flex justify-between items-center z-50 rounded-4xl shadow-sm ring-1 ring-white/80">
      <Link to="/" className="flex items-center gap-2 text-slate-800 font-bold text-xl tracking-tight">
        <Activity className="w-6 h-6 text-pastel-teal" />
        MedChat
      </Link>
      <div className="flex gap-6 items-center">
        {user ? (
          <>
            <Link to="/home" className="text-slate-500 hover:text-slate-800 font-medium transition-colors">Dashboard</Link>
            <Link to="/home" className="text-slate-500 hover:text-slate-800 font-medium transition-colors">Health Profile</Link>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 rounded-full bg-cream-200 text-slate-600 hover:bg-cream-100 transition-colors font-medium text-sm border border-black/5"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-slate-500 hover:text-slate-800 font-medium transition-colors">Sign In</Link>
            <Link to="/signup" className="px-5 py-2 rounded-full bg-pastel-teal text-white shadow-sm hover:shadow-md hover:bg-pastel-teal_hover transition-all duration-200 font-medium">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  )
}
