from langchain_community.document_loaders import PyPDFLoader, DirectoryLoader
from langchain_core.documents import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from typing import List


#Extract Data From the PDF File
def load_pdf_file(data):
    loader= DirectoryLoader(data,
                            glob="*.pdf",
                            loader_cls=PyPDFLoader)

    documents=loader.load()

    return documents



def filter_to_minimal_docs(docs: List[Document]) -> List[Document]:
    """
    Given a list of Document objects, return a new list of Document objects
    containing only 'source' in metadata and the original page_content.
    """
    minimal_docs: List[Document] = []
    for doc in docs:
        src = doc.metadata.get("source")
        minimal_docs.append(
            Document(
                page_content=doc.page_content,
                metadata={"source": src}
            )
        )
    return minimal_docs



#Split the Data into Text Chunks
def text_split(extracted_data):
    text_splitter=RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    text_chunks=text_splitter.split_documents(extracted_data)
    return text_chunks



import os
import requests
from langchain_core.embeddings import Embeddings

class HFInferenceEmbeddings(Embeddings):
    def __init__(self):
        self.api_url = "https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2"
        self.headers = {
    "Authorization": f"Bearer {os.environ.get('HUGGINGFACEHUB_API_TOKEN')}",
    "Content-Type": "application/json"
}

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        response = requests.post(
            self.api_url, 
            headers=self.headers, 
            json={"inputs": texts}
        )
        if response.status_code != 200:
            raise Exception(f"Hugging Face API error: {response.status_code} - {response.text}")
        
        result = response.json()
        if not isinstance(result, list):
            raise Exception(f"Invalid response format from Hugging Face API: {result}")
        return result

    def embed_query(self, text: str) -> List[float]:
        return self.embed_documents([text])[0]

#Download the Embeddings from HuggingFace 
def download_hugging_face_embeddings():
    return HFInferenceEmbeddings()