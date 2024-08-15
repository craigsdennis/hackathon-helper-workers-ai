# Python Workers AI Starter Kit

## Installation

Copy your secrets file and add your credentials.

Get your credentials at dash.cloudflare.com, AI > Use REST API, Create a Workers AI API Token

```bash
cp .streamlit/secrets.toml.example .streamlit/secrets.toml
```

```bash
python -m venv venv
source ./venv/bin/activate
python -m pip install -r requirements.txt
```

## Develop

```bash
python -m streamlit run app.py
```

## More resources

- [Workers AI Documentation](https://developers.cloudflare.com/workers-ai/)
- [Streamlit Examples](https://github.com/craigsdennis/image-model-streamlit-workers-ai)
