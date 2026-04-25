import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import InputField from '../components/InputField'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      navigate('/onboarding')
    }
  }

  return (
    <div className="flex justify-center items-center h-[calc(100vh-80px)] px-4">
      <div className="w-full max-w-md p-8 rounded-[24px] bg-cream-50 border border-black/5 shadow-soft">
        <h2 className="text-3xl font-extrabold text-slate-800 mb-6 text-center tracking-tight">Create Account</h2>
        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100">{error}</div>}
        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <InputField 
            label="Email" 
            type="email" 
            required 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="you@example.com"
          />
          <InputField 
            label="Password" 
            type="password" 
            required 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="••••••••"
          />
          <button 
            type="submit" 
            disabled={loading}
            className="mt-4 w-full py-4 rounded-full bg-pastel-teal text-white font-bold text-lg shadow-sm hover:shadow-md hover:bg-pastel-teal_hover transition-all duration-200 disabled:opacity-70 disabled:hover:bg-pastel-teal"
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
        <p className="mt-6 text-center text-slate-600">
          Already have an account? <Link to="/login" className="text-pastel-teal font-bold hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  )
}
