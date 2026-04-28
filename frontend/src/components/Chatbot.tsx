import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { Send, Bot, Loader2, Trash2 } from 'lucide-react'
import { supabase } from '../lib/supabaseClient.ts'

type Message = { id: string; text: string; isBot: boolean }

const API_URL = import.meta.env.VITE_API_URL

export default function Chatbot({ isDemo = false }: { isDemo?: boolean }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: 'Hello! I am your AI Health Assistant. How can I help you today?',
      isBot: true,
    },
  ])

  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isFetchingChats, setIsFetchingChats] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      const container = messagesEndRef.current.parentElement
      if (container) {
        container.scrollTop = container.scrollHeight
      }
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  useEffect(() => {
    if (isDemo) return

    const loadChats = async () => {
      setIsFetchingChats(true)

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        setUserId(user.id)

        const { data, error } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true })

        if (error) {
          console.error('Error fetching chats from Supabase:', error.message)
        } else if (data && data.length > 0) {
          const loadedMessages = data.map((msg: any) => ({
            id: msg.id,
            text: msg.content,
            isBot: msg.role === 'assistant',
          }))

          setMessages([
            {
              id: 'welcome',
              text: 'Hello! I am your AI Health Assistant. How can I help you today?',
              isBot: true,
            },
            ...loadedMessages,
          ])
        }
      }

      setIsFetchingChats(false)
    }

    loadChats()
  }, [isDemo])

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault()

    if (!input.trim() || isLoading) return

    const userMsg = input.trim()
    const userMessageId = crypto.randomUUID()

    setInput('')
    setMessages((prev) => [
      ...prev,
      { id: userMessageId, text: userMsg, isBot: false },
    ])

    setIsLoading(true)

    try {
      if (!isDemo && userId) {
        const { error: insertError } = await supabase
          .from('chat_messages')
          .insert({
            user_id: userId,
            role: 'user',
            content: userMsg,
          })

        if (insertError) {
          console.error('Error saving user message:', insertError.message)
        }
      }

      if (!API_URL) {
        throw new Error('VITE_API_URL is missing. Add it in frontend/.env')
      }

      const formData = new URLSearchParams()
      formData.append('msg', userMsg)

      const res = await axios.post(`${API_URL}/get`, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })

      const botMsg =
        typeof res.data === 'string' ? res.data : JSON.stringify(res.data)

      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), text: botMsg, isBot: true },
      ])

      if (!isDemo && userId) {
        const { error: botInsertError } = await supabase
          .from('chat_messages')
          .insert({
            user_id: userId,
            role: 'assistant',
            content: botMsg,
          })

        if (botInsertError) {
          console.error('Error saving bot message:', botInsertError.message)
        }
      }
    } catch (error) {
      console.error(error)

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          text: 'Sorry, I encountered an error. Please try again.',
          isBot: true,
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearChat = async () => {
    if (window.confirm('Are you sure you want to clear your chat history?')) {
      setMessages([
        {
          id: 'welcome',
          text: 'Hello! I am your AI Health Assistant. How can I help you today?',
          isBot: true,
        },
      ])

      if (!isDemo && userId) {
        await supabase.from('chat_messages').delete().eq('user_id', userId)
      }
    }
  }

  return (
    <div className="flex flex-col h-full bg-cream-50 rounded-[20px] sm:rounded-[28px] border border-black/5 shadow-soft overflow-hidden">
      <div className="p-3 sm:p-6 bg-pastel-teal_light border-b border-black/5 text-slate-800 flex justify-between items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-white/60 shadow-sm flex items-center justify-center text-pastel-teal">
            <Bot className="w-5 sm:w-6 h-5 sm:h-6" />
          </div>

          <div>
            <h2 className="font-bold text-sm sm:text-lg tracking-tight">
              AI Health Assistant
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">Response may delay due to api limitations</p>
          </div>
        </div>

        {!isDemo && userId && (
          <button
            onClick={handleClearChat}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 text-xs sm:text-sm text-slate-500 hover:text-red-600 hover:bg-white/50 rounded-lg transition-colors border border-transparent hover:border-black/5"
            title="Clear Chat History"
          >
            <Trash2 className="w-3 sm:w-4 h-3 sm:h-4" /> <span className="hidden sm:inline">Clear</span>
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-3 sm:space-y-4 bg-cream-50">
        {isFetchingChats ? (
          <div className="flex justify-center py-8 sm:py-10">
            <Loader2 className="w-5 sm:w-6 h-5 sm:h-6 animate-spin text-pastel-teal" />
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[90%] sm:max-w-[85%] md:max-w-[80%] rounded-[16px] sm:rounded-[20px] p-3 sm:p-4 shadow-sm text-xs sm:text-sm md:text-base ${
                  msg.isBot
                    ? 'bg-white border border-black/5 text-slate-700 rounded-tl-sm'
                    : 'bg-pastel-clay text-white rounded-tr-sm'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-black/5 text-slate-500 rounded-[16px] sm:rounded-[20px] rounded-tl-sm p-3 sm:p-4 shadow-sm flex gap-2 items-center text-xs sm:text-sm">
              <Loader2 className="w-3 sm:w-4 h-3 sm:h-4 animate-spin text-pastel-clay" />
              Thinking...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 sm:p-4 bg-cream-100 border-t border-black/5">
        <div className="flex gap-2 mb-2 sm:mb-3 overflow-x-auto pb-2 scrollbar-hide">
          {['Just listen', 'Give suggestions', 'Explain symptoms'].map(
            (chip) => (
              <button
                key={chip}
                onClick={() => setInput(chip)}
                className="whitespace-nowrap px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white border border-black/5 text-slate-600 text-xs sm:text-sm font-medium hover:shadow-md transition-all duration-200 shadow-sm"
              >
                {chip}
              </button>
            )
          )}
        </div>

        <form onSubmit={handleSend} className="flex gap-2 items-center flex-wrap sm:flex-nowrap">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question..."
            className="flex-1 min-w-0 px-4 sm:px-5 py-3 sm:py-4 rounded-full bg-white border border-black/5 text-slate-800 text-sm sm:text-base placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pastel-teal/50 transition-all shadow-sm"
          />

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-pastel-teal text-white flex items-center justify-center shadow-sm hover:shadow-md hover:bg-pastel-teal_hover transition-all duration-200 disabled:opacity-50 disabled:hover:bg-pastel-teal flex-shrink-0"
          >
            <Send className="w-4 sm:w-5 h-4 sm:h-5 ml-1" />
          </button>
        </form>
      </div>
    </div>
  )
}