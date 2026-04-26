from dotenv import load_dotenv
import os
from time import sleep
from pinecone import Pinecone, ServerlessSpec
from langchain_pinecone import PineconeVectorStore

from src.helper import (
    load_pdf_file,
    filter_to_minimal_docs,
    text_split,
    download_hugging_face_embeddings
)

load_dotenv()

PINECONE_API_KEY = os.environ.get("PINECONE_API_KEY")
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

os.environ["PINECONE_API_KEY"] = PINECONE_API_KEY
os.environ["GOOGLE_API_KEY"] = GEMINI_API_KEY

extracted_data = load_pdf_file(data="data/")
filter_data = filter_to_minimal_docs(extracted_data)
text_chunks = text_split(filter_data)

print(f"Total chunks: {len(text_chunks)}")

embeddings = download_hugging_face_embeddings()

pc = Pinecone(api_key=PINECONE_API_KEY)

index_name = "medchat-gemini"

if not pc.has_index(index_name):
    pc.create_index(
        name=index_name,
        dimension=3072,  # change to 3072 if using default gemini-embedding-001
        metric="cosine",
        spec=ServerlessSpec(cloud="aws", region="us-east-1"),
    )

batch_size = 25
delay_between_batches = 15
max_retries = 5

total_batches = (len(text_chunks) + batch_size - 1) // batch_size

for i in range(0, len(text_chunks), batch_size):
    batch = text_chunks[i:i + batch_size]
    batch_number = i // batch_size + 1

    for attempt in range(max_retries):
        try:
            PineconeVectorStore.from_documents(
                documents=batch,
                index_name=index_name,
                embedding=embeddings,
            )

            print(f"Uploaded batch {batch_number}/{total_batches}")
            break

        except Exception as e:
            error_text = str(e)

            if "429" in error_text or "RESOURCE_EXHAUSTED" in error_text or "quota" in error_text.lower():
                wait_time = 60 + (attempt * 30)
                print(f"Rate limit hit on batch {batch_number}. Waiting {wait_time} seconds...")
                sleep(wait_time)
            else:
                print(f"Error on batch {batch_number}: {e}")
                raise e

    else:
        print(f"Failed batch {batch_number} after {max_retries} retries.")
        break

    sleep(delay_between_batches)

print("Indexing completed.")