import logging
from functools import lru_cache

from google import genai
from google.genai import types

from app.core.config import settings


logger = logging.getLogger(__name__)


class AIGateway:
    """Central Gemini client with bounded requests, retries and usage logging."""

    def __init__(self):
        if not settings.GEMINI_API_KEY:
            raise RuntimeError("GEMINI_API_KEY is not configured")
        self.client = genai.Client(
            api_key=settings.GEMINI_API_KEY,
            http_options=types.HttpOptions(
                timeout=30_000,
                retry_options=types.HttpRetryOptions(
                    attempts=3,
                    initial_delay=1,
                    max_delay=8,
                    exp_base=2,
                    jitter=0.2,
                    http_status_codes=[408, 429, 500, 502, 503, 504],
                ),
            ),
        )

    def generate_text(self, prompt: str, *, model: str | None = None, json_mode: bool = False) -> str:
        response = self.client.models.generate_content(
            model=(model or settings.AI_FAST_MODEL).removeprefix("models/"),
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json" if json_mode else "text/plain",
                temperature=0.2,
                max_output_tokens=8192,
            ),
        )
        usage = getattr(response, "usage_metadata", None)
        logger.info("AI request completed model=%s total_tokens=%s", model or settings.AI_FAST_MODEL,
                    getattr(usage, "total_token_count", None))
        if not response.text:
            raise RuntimeError("AI provider returned an empty response")
        return response.text.strip()

    def generate_with_bytes(self, prompt: str, data: bytes, mime_type: str, *, model: str | None = None) -> str:
        response = self.client.models.generate_content(
            model=(model or settings.AI_FAST_MODEL).removeprefix("models/"),
            contents=[prompt, types.Part.from_bytes(data=data, mime_type=mime_type)],
            config=types.GenerateContentConfig(response_mime_type="application/json", temperature=0.2,
                                               max_output_tokens=8192),
        )
        if not response.text:
            raise RuntimeError("AI provider returned an empty response")
        return response.text.strip()


@lru_cache(maxsize=1)
def get_ai_gateway() -> AIGateway:
    return AIGateway()
