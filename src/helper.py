from langchain_community.document_loaders import PyPDFLoader, DirectoryLoader
from langchain_core.documents import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_core.embeddings import Embeddings
from typing import List
import os
import requests


# Extract data from PDF files
def load_pdf_file(data):
    loader = DirectoryLoader(
        data,
        glob="*.pdf",
        loader_cls=PyPDFLoader
    )

    documents = loader.load()
    return documents


def filter_to_minimal_docs(docs: List[Document]) -> List[Document]:
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


# Split data into text chunks
def text_split(extracted_data):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50
    )

    text_chunks = text_splitter.split_documents(extracted_data)
    return text_chunks


class HFInferenceEmbeddings(Embeddings):
    def __init__(self):
        self.api_url = (
            "https://router.huggingface.co/hf-inference/models/"
            "sentence-transformers/all-MiniLM-L6-v2/pipeline/feature-extraction"
        )

        token = os.environ.get("HUGGINGFACEHUB_API_TOKEN")

        if not token:
            raise Exception("Missing HUGGINGFACEHUB_API_TOKEN environment variable")

        self.headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }

    def _mean_pool(self, token_embeddings: List[List[float]]) -> List[float]:
        """
        Converts token embeddings into one sentence/document embedding.
        """
        if not token_embeddings or not isinstance(token_embeddings[0], list):
            raise Exception(f"Invalid token embedding format: {token_embeddings}")

        pooled_embedding = [
            sum(values) / len(values)
            for values in zip(*token_embeddings)
        ]

        return pooled_embedding

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        response = requests.post(
            self.api_url,
            headers=self.headers,
            json={"inputs": texts},
            timeout=60
        )

        if response.status_code != 200:
            raise Exception(
                f"Hugging Face API error: {response.status_code} - {response.text}"
            )

        result = response.json()

        if not isinstance(result, list):
            raise Exception(f"Invalid response format from Hugging Face API: {result}")

        embeddings = []

        for item in result:
            # HF feature extraction returns token embeddings:
            # [[token_vector], [token_vector], ...]
            if isinstance(item, list) and item and isinstance(item[0], list):
                embeddings.append(self._mean_pool(item))

            # In case API directly returns sentence embedding
            elif isinstance(item, list) and item and isinstance(item[0], (int, float)):
                embeddings.append(item)

            else:
                raise Exception(f"Unexpected embedding format: {item}")

        return embeddings

    def embed_query(self, text: str) -> List[float]:
        return self.embed_documents([text])[0]


# Download / return embeddings
def download_hugging_face_embeddings():
    return HFInferenceEmbeddings()