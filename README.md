🩺 MedChat – AI Health Assistant

MedChat is an AI-powered health assistant that provides context-aware responses using a RAG (Retrieval-Augmented Generation) approach.
Instead of giving generic answers, it retrieves relevant information from a knowledge base and generates more accurate, meaningful responses.

🚀 Features
💬 AI chatbot for health-related queries
🧠 Context-aware answers using RAG pipeline
👤 User authentication (Supabase)
📊 Personalized responses based on user profile
🗂 Chat history storage (for logged-in users)
🎨 Clean and minimal UI
⚙️ Tech Stack

Frontend
  -React (Vite)
  -Tailwind CSS

Backend
  -Flask (Python)
  -LangChain

AI & Data
  -Gemini (LLM)
  -HuggingFace Inference API (Embeddings)
  -Pinecone (Vector Database)

Database & Auth
  -Supabase

Deployment
  -Frontend → Vercel
  -Backend → Render

🧠 How It Works (RAG Flow)
User Query
   ↓
Embedding (HuggingFace API)
   ↓
Vector Search (Pinecone)
   ↓
Relevant Context Retrieved
   ↓
Gemini LLM
   ↓
Final Response


📦 Installation (Local Setup)
1. Clone the repo
git clone https://github.com/your-username/medchat.git
cd medchat
2. Frontend Setup
cd frontend
npm install
npm run dev

Create .env:

VITE_API_URL=http://localhost:3000
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
3. Backend Setup
cd backend
pip install -r requirements.txt
python app.py

Create .env:

PINECONE_API_KEY=your_key
GEMINI_API_KEY=your_key
HUGGINGFACEHUB_API_TOKEN=your_key
🌐 Deployment

Frontend (Vercel):

Root Directory: frontend
Build Command: npm run build
Output Directory: dist

Backend (Render):

Start Command:
gunicorn app:app --bind 0.0.0.0:$PORT --timeout 300

📌 Future Improvements
📄 Medical report summarization
📍 Location-based health alerts
📱 Mobile app integration
⚡ Faster response optimization
🔐 Enhanced data privacy
🤝 Contributing

Feel free to fork this repo, raise issues, or suggest improvements!
