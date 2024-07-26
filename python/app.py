# Heavily based on https://docs.streamlit.io/develop/tutorials/llms/build-conversational-apps

import json

import streamlit as st
from cloudflare import Cloudflare


st.title("Workers AI Text Generation Hackathon Helper")

# Set Cloudflare API key from Streamlit secrets
client = Cloudflare(api_token=st.secrets["CLOUDFLARE_API_TOKEN"])

# Initialize chat history
if "messages" not in st.session_state:
    st.session_state.messages = []

# Display chat messages from history on app rerun
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# Accept user input
if prompt := st.chat_input("What is up?"):
    # Add user message to chat history
    st.session_state.messages.append({"role": "user", "content": prompt})
    # Display user message in chat message container
    with st.chat_message("user"):
        st.markdown(prompt)

    # Display assistant response in chat message container
    with st.chat_message("assistant"):
        with client.workers.ai.with_streaming_response.run(
            account_id=st.secrets["CLOUDFLARE_ACCOUNT_ID"],
            model_name="@cf/meta/llama-3.1-8b-instruct",
            messages=[
                {"role": m["role"], "content": m["content"]}
                for m in st.session_state.messages
            ],
            stream=True,
        ) as response:
            # The response is an EventSource object that looks like so
            # data: {"response": "Hello "}
            # data: {"response": ", "}
            # data: {"response": "World!"}
            # data: [DONE]
            # Create a token iterator
            def iter_tokens(r):
                for line in r.iter_lines():
                    if line.startswith("data: ") and not line.endswith("[DONE]"):
                        entry = json.loads(line.replace("data: ", ""))
                        yield entry["response"]

            completion = st.write_stream(iter_tokens(response))
    st.session_state.messages.append({"role": "assistant", "content": completion})
