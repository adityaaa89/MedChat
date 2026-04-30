from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import os

from src.helper import download_hugging_face_embeddings
from src.prompt import system_prompt

from langchain_pinecone import PineconeVectorStore
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate

app = Flask(__name__)
CORS(app)

load_dotenv()

os.environ["PINECONE_API_KEY"] = os.getenv("PINECONE_API_KEY", "")
os.environ["GOOGLE_API_KEY"] = os.getenv("GEMINI_API_KEY", "")

rag_chain_instance = None


def get_rag_chain():
    global rag_chain_instance

    if rag_chain_instance is None:
        embeddings = download_hugging_face_embeddings()

        docsearch = PineconeVectorStore.from_existing_index(
            index_name="medchat",
            embedding=embeddings
        )

        retriever = docsearch.as_retriever(
            search_type="similarity",
            search_kwargs={"k": 2}
        )

        llm = ChatGoogleGenerativeAI(
            model="gemini-3.1-flash-lite-preview",
            transport="rest"
        )

        prompt = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            ("human", "{input}")
        ])

        qa_chain = create_stuff_documents_chain(llm, prompt)
        rag_chain_instance = create_retrieval_chain(retriever, qa_chain)

    return rag_chain_instance


@app.route("/")
def home():
    return jsonify({
        "status": "running",
        "endpoint": "POST /get"
    })


@app.route("/get", methods=["POST"])
def chat():
    data = request.get_json(silent=True) or {}
    msg = data.get("msg") or request.form.get("msg")

    if not msg:
        return jsonify({"error": "msg required"}), 400

    chain = get_rag_chain()
    result = chain.invoke({"input": msg})

    return jsonify({"answer": result["answer"]})


if __name__ == "__main__":
    port = int(os.getenv("PORT", 10000))
    app.run(host="0.0.0.0", port=port)