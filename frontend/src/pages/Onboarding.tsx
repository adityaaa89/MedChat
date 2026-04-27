import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient.ts'
import InputField from '../components/InputField'
import type { User } from '@supabase/supabase-js'

export default function Onboarding() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const [userId, setUserId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    height: '',
    weight: '',
    blood_group: '',
    disease: '',
    allergies: '',
  })

  useEffect(() => {
    supabase.auth.getUser().then(({ data }: { data: { user: User | null } }) => {
      const user = data.user

      if (!user) {
        navigate('/login')
      } else {
        setUserId(user.id)
      }
    })
  }, [navigate])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!userId) return

    setLoading(true)
    setError(null)

    const { error } = await supabase.from('profiles').upsert({
      id: userId,
      name: formData.name,
      age: Number(formData.age),
      height: formData.height,
      weight: Number(formData.weight),
      blood_group: formData.blood_group,
      disease: formData.disease || null,
      allergies: formData.allergies || null,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      navigate('/home')
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-80px)] px-4 py-6 sm:py-8">
      <div className="w-full max-w-2xl p-6 sm:p-8 md:p-12 rounded-[20px] sm:rounded-[24px] bg-cream-50 border border-black/5 shadow-soft">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-2 text-center tracking-tight">
          Complete Your Profile
        </h2>

        <p className="text-center text-slate-500 mb-6 sm:mb-8 text-sm sm:text-base">
          Tell us a bit about your health so we can personalize your experience.
        </p>

        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-x-6 gap-y-3 sm:gap-y-4">
          <div className="sm:col-span-2">
            <InputField
              label="Full Name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
            />
          </div>

          <InputField
            label="Age"
            name="age"
            type="number"
            required
            value={formData.age}
            onChange={handleChange}
            placeholder="28"
          />

          <InputField
            label="Blood Group"
            name="blood_group"
            required
            value={formData.blood_group}
            onChange={handleChange}
            placeholder="O+"
          />

          <InputField
            label="Height (ft/in)"
            name="height"
            required
            value={formData.height}
            onChange={handleChange}
            placeholder="5'10"
          />

          <InputField
            label="Weight (kg)"
            name="weight"
            type="number"
            required
            value={formData.weight}
            onChange={handleChange}
            placeholder="70"
          />

          <div className="sm:col-span-2">
            <InputField
              label="Chronic Diseases (Optional)"
              name="disease"
              value={formData.disease}
              onChange={handleChange}
              placeholder="None"
            />
          </div>

          <div className="sm:col-span-2">
            <InputField
              label="Allergies (Optional)"
              name="allergies"
              value={formData.allergies}
              onChange={handleChange}
              placeholder="Peanuts, Penicillin"
            />
          </div>

          <div className="sm:col-span-2 mt-4 sm:mt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 sm:py-4 rounded-full bg-pastel-teal text-white font-bold text-base sm:text-lg shadow-sm hover:shadow-md hover:bg-pastel-teal_hover transition-all duration-200 disabled:opacity-70 disabled:hover:bg-pastel-teal"
            >
              {loading ? 'Saving Profile...' : 'Complete Setup'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}