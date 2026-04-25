import os
import time
from dotenv import load_dotenv

load_dotenv()

# Test Pinecone
print("Testing Pinecone...")
try:
    from pinecone import Pinecone
    os.environ["GOOGLE_API_KEY"] = os.environ.get("GEMINI_API_KEY", "")
    pc = Pinecone(api_key=os.environ.get("PINECONE_API_KEY"))
    indexes = pc.list_indexes()
    print("Pinecone reachable! Indexes:", [i.name for i in indexes])
except Exception as e:
    print("Pinecone Error:", e)

print("\nTesting Gemini Generation...")
try:
    from langchain_google_genai import ChatGoogleGenerativeAI
    llm = ChatGoogleGenerativeAI(model="gemini-3.1-flash-lite-preview", transport="rest", timeout=10)
    print("Invoking model...")
    response = llm.invoke("Hello, answer in one word.")
    print("Gemini response:", response.content)
except Exception as e:
    print("Gemini Error:", e)
