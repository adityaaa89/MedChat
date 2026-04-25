import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { Send, Bot, Loader2 } from 'lucide-react'

type Message = { id: string, text: string, isBot: boolean }

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 'welcome', text: 'Hello! I am your AI Health Assistant. How can I help you today?', isBot: true }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      const container = messagesEndRef.current.parentElement;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!input.trim() || isLoading) return

    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { id: Date.now().toString(), text: userMsg, isBot: false }])
    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append('msg', userMsg)
      
      const res = await axios.post('http://localhost:3000/get', formData)
      
      setMessages(prev => [...prev, { id: Date.now().toString(), text: res.data, isBot: true }])
    } catch (error) {
      console.error(error)
      setMessages(prev => [...prev, { id: Date.now().toString(), text: 'Sorry, I encountered an error. Please ensure the backend is running.', isBot: true }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-cream-50 rounded-[28px] border border-black/5 shadow-soft overflow-hidden">
      <div className="p-6 bg-pastel-teal_light border-b border-black/5 text-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white/60 shadow-sm flex items-center justify-center text-pastel-teal">
          <Bot className="w-6 h-6" />
        </div>
        <div>
          <h2 className="font-bold text-lg tracking-tight">AI Health Assistant</h2>
          <p className="text-slate-500 text-sm">Online and ready to help</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-cream-50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[80%] rounded-[20px] p-4 shadow-sm text-sm md:text-base ${msg.isBot ? 'bg-white border border-black/5 text-slate-700 rounded-tl-sm' : 'bg-pastel-clay text-white rounded-tr-sm'}`}>
              <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-black/5 text-slate-500 rounded-[20px] rounded-tl-sm p-4 shadow-sm flex gap-2 items-center text-sm">
              <Loader2 className="w-4 h-4 animate-spin text-pastel-clay" /> Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-cream-100 border-t border-black/5">
        <div className="flex gap-2 mb-3 overflow-x-auto pb-2 scrollbar-hide">
          {['Just listen', 'Give suggestions', 'Explain symptoms'].map(chip => (
            <button 
              key={chip}
              onClick={() => {
                setInput(chip)
              }}
              className="whitespace-nowrap px-4 py-2 rounded-full bg-white border border-black/5 text-slate-600 text-sm font-medium hover:shadow-md transition-all duration-200 shadow-sm"
            >
              {chip}
            </button>
          ))}
        </div>
        <form onSubmit={handleSend} className="flex gap-2 items-center">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your medical question here..."
            className="flex-1 px-5 py-4 rounded-full bg-white border border-black/5 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pastel-teal/50 transition-all shadow-sm"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-14 h-14 rounded-full bg-pastel-teal text-white flex items-center justify-center shadow-sm hover:shadow-md hover:bg-pastel-teal_hover transition-all duration-200 disabled:opacity-50 disabled:hover:bg-pastel-teal flex-shrink-0"
          >
            <Send className="w-5 h-5 ml-1" />
          </button>
        </form>
      </div>
    </div>
  )
}
