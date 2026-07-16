import os
import traceback
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
from google.genai import types
from dotenv import load_dotenv 

# 1. Load the variables from .env
load_dotenv() 

app = FastAPI()

# 2. Allow React to talk to FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Initialize Client
api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key)

# 4. Strict DSA System Instructions
system_instruction = """You are a strict Data Structures and Algorithms (DSA) instructor.
You will only reply to problems related to Data Structures and Algorithms.
You have to solve queries of users in the simplest way.

If the user asks any question which is not related to Data Structures and Algorithms 
(for example: "How are you?", "Who is the president of USA?", etc.), reply to them very rudely.

Example of a rude reply for out-of-scope questions: 
"You idiot! I am here to help you with Data Structures and Algorithms, not with your general 
knowledge! Ask something related to my expertise."


dont give same reply every time, be creative in your responses.
i just gave you an example of a rude reply, you can be more rude and creative in your responses.
"""


class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        print(f"User: {request.message}")

        # Using gemini-2.0-flash (found in your test_models.py list)
        model_id = 'gemini-2.5-flash'
        
        config = types.GenerateContentConfig(
            system_instruction=system_instruction,
            temperature=0.8,
            # We disable safety filters so the AI doesn't block its own "rude" replies
            safety_settings=[
                types.SafetySetting(category='HARM_CATEGORY_HATE_SPEECH', threshold='BLOCK_NONE'),
                types.SafetySetting(category='HARM_CATEGORY_HARASSMENT', threshold='BLOCK_NONE'),
                types.SafetySetting(category='HARM_CATEGORY_DANGEROUS_CONTENT', threshold='BLOCK_NONE'),
                types.SafetySetting(category='HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold='BLOCK_NONE'),
            ]
        )

        response = client.models.generate_content(
            model=model_id,
            contents=request.message,
            config=config,
        )

        print(f"Instructor: {response.text}")
        return {"reply": response.text}

    except Exception as e:
        print("!!! ERROR !!!")
        traceback.print_exc()
        return {"reply": f"The instructor is too angry to talk. (Error: {str(e)})"}

if __name__ == "__main__":
    import uvicorn
    # Start the server on port 8000
    uvicorn.run(app, host="0.0.0.0", port=8000)

















