import os
from langchain.chat_models import init_chat_model


def create_llm(model_name=None):
    """Create an LLM instance based on the LLM_PROVIDER environment variable."""
    provider = os.getenv("LLM_PROVIDER", "anthropic")

    if provider == "openai":
        return init_chat_model(model=model_name or "gpt-4o")
    elif provider == "anthropic":
        return init_chat_model(
            model=model_name or "claude-sonnet-4-20250514", model_provider="anthropic"
        )
    elif provider == "google":
        return init_chat_model(
            model=model_name or "gemini-2.0-flash", model_provider="google_genai"
        )
    else:
        raise ValueError(f"Unknown LLM_PROVIDER: {provider}")
