from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
from src.helper import download_hugging_face_embeddings
from langchain_pinecone import PineconeVectorStore
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv
from src.prompt import *
from flask import Flask, jsonify, request
import os

app = Flask(__name__)
CORS(app)

load_dotenv()

PINECONE_API_KEY=os.environ.get('PINECONE_API_KEY')
Gemini_API_KEY=os.environ.get('GEMINI_API_KEY')


os.environ["PINECONE_API_KEY"] = PINECONE_API_KEY
if Gemini_API_KEY:
    os.environ["GOOGLE_API_KEY"] = Gemini_API_KEY

rag_chain_instance = None

def get_rag_chain():
    global rag_chain_instance
    if rag_chain_instance is None:
        embeddings = download_hugging_face_embeddings()
        index_name = "medchat"
        docsearch = PineconeVectorStore.from_existing_index(
            index_name=index_name,
            embedding=embeddings
        )
        retriever = docsearch.as_retriever(search_type="similarity", search_kwargs={"k":3})
        
        chatModel = ChatGoogleGenerativeAI(model="gemini-3.1-flash-lite-preview", transport="rest")
        prompt = ChatPromptTemplate.from_messages(
            [
                ("system", system_prompt),
                ("human", "{input}"),
            ]
        )
        
        question_answer_chain = create_stuff_documents_chain(chatModel, prompt)
        rag_chain_instance = create_retrieval_chain(retriever, question_answer_chain)
    return rag_chain_instance



@app.route("/")
def index():
    return jsonify({
        "status": "MedChat backend is running",
        "endpoint": "POST /get"
    })



@app.route("/get", methods=["GET", "POST"])
def chat():
    msg = request.form["msg"]
    input = msg
    # print(input)
    chain = get_rag_chain()
    response = chain.invoke({"input": msg})
    # print("Response : ", response["answer"])
    return str(response["answer"])



if __name__ == '__main__':
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)