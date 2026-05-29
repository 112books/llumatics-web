---
name: scrapegraphai
description: AI-powered web scraping with ScrapeGraphAI. Use this skill whenever the user wants to extract data from websites, scrape structured information, monitor web content, or build scrapers without CSS selectors. Triggers on: "scrape this page", "extract data from URL", "get structured data from website", "scrape product prices", "extract articles from news site", "monitor webpage", "build a scraper", or any request involving extracting web content using AI. Always use this skill for web data extraction tasks — it handles JavaScript-heavy sites, dynamic content, and produces clean structured output from natural language prompts.
---

# ScrapeGraphAI

LLM-powered web scraping: describe what you want in plain English, no CSS selectors needed.

## Installation

```bash
pip install scrapegraphai
playwright install  # Browser runtime (required)
```

For a specific LLM provider, also install its SDK:

```bash
pip install openai      # OpenAI / GPT
pip install anthropic   # Claude
pip install groq        # Groq (free tier available)
# Ollama: no pip package needed, install from ollama.com
```

## Quick Start

```python
from scrapegraphai.graphs import SmartScraperGraph

graph_config = {
    "llm": {
        "api_key": "your-openai-key",
        "model": "openai/gpt-4o-mini",
    },
    "verbose": True,
    "headless": True,
}

scraper = SmartScraperGraph(
    prompt="Extract all product names and prices",
    source="https://example.com/products",
    config=graph_config,
)

result = scraper.run()
print(result)
```

## Choosing the Right Graph

| Graph | When to use |
|-------|-------------|
| `SmartScraperGraph` | Single URL, most common case |
| `SmartScraperMultiGraph` | Multiple URLs in parallel |
| `SearchGraph` | Search web + extract from results |
| `OmniScraperGraph` | Like SmartScraper but also handles images |
| `ScriptCreatorGraph` | Generate a reusable Python scraper script |
| `JSONScraperGraph` | Extract from a JSON file or API response |

## LLM Providers

### OpenAI (most reliable)
```python
"llm": {
    "api_key": "sk-...",
    "model": "openai/gpt-4o-mini",  # cheap and fast
}
```

### Anthropic (Claude)
```python
"llm": {
    "api_key": "sk-ant-...",
    "model": "anthropic/claude-3-haiku-20240307",
}
```

### Groq (fast, free tier)
```python
"llm": {
    "api_key": "gsk_...",
    "model": "groq/llama-3.1-8b-instant",
}
```

### Ollama (local, free, no API key)
```python
"llm": {
    "model": "ollama/llama3.2",
    "base_url": "http://localhost:11434",
},
"embedder": {
    "model": "ollama/nomic-embed-text",
    "base_url": "http://localhost:11434",
},
```

## Structured Output with Pydantic

Define a schema to get validated, typed data back:

```python
from pydantic import BaseModel, Field
from typing import List

class Product(BaseModel):
    name: str
    price: float
    in_stock: bool = Field(description="Whether the item is available")

class ProductList(BaseModel):
    products: List[Product]

scraper = SmartScraperGraph(
    prompt="Extract all products",
    source="https://example.com/shop",
    config=graph_config,
    schema=ProductList,
)

result = scraper.run()
# result is validated against ProductList
```

## Common Patterns

### Scrape a single page
```python
from scrapegraphai.graphs import SmartScraperGraph

result = SmartScraperGraph(
    prompt="Extract title, author, date, and full body text",
    source="https://example.com/article",
    config=graph_config,
).run()
```

### Scrape multiple URLs in parallel
```python
from scrapegraphai.graphs import SmartScraperMultiGraph

result = SmartScraperMultiGraph(
    prompt="Extract company name, CEO, and headquarters",
    source=["https://apple.com", "https://google.com", "https://microsoft.com"],
    config=graph_config,
).run()
```

### Search the web and extract results
```python
from scrapegraphai.graphs import SearchGraph

result = SearchGraph(
    prompt="Top 5 Python web scraping libraries in 2025 with pros and cons",
    config=graph_config,
).run()
```

### Generate a reusable scraper script
```python
from scrapegraphai.graphs import ScriptCreatorGraph

script = ScriptCreatorGraph(
    prompt="Extract product name, price, and availability",
    source="https://example.com/product",
    config=graph_config,
).run()

print(script)  # Prints a Python script you can save and reuse
```

## Config Options

```python
graph_config = {
    "llm": { ... },              # Required: LLM provider
    "embedder": { ... },         # Required for SearchGraph with Ollama
    "verbose": True,             # Show debug output
    "headless": True,            # Run browser headless (False = visible window)
    "timeout": 120,              # Page load timeout in seconds
    "loader_kwargs": {
        "proxy": "http://proxy:8080",   # Optional proxy
    },
}
```

## CLI: just-scrape

For one-off scraping without writing Python:

```bash
npm install -g just-scrape
export SGAI_API_KEY="sgai-..."  # From scrapegraphai.com

# Get page as markdown
just-scrape scrape https://example.com --output markdown

# Extract structured data
just-scrape extract https://example.com --prompt "Get all products"

# Search + extract
just-scrape search "best coffee shops in Barcelona"

# Crawl a site
just-scrape crawl https://example.com --depth 2
```

## Troubleshooting

**Playwright not installed / browser missing:**
```bash
playwright install chromium
```

**Result is empty or wrong:**
- Make the prompt more specific ("Extract the H1 title" vs "Get title")
- Use `headless: False` to watch what the browser loads
- Try `SmartScraperGraph` before more complex graph types
- Add `"verbose": True` to see what's happening

**JS-heavy site returns empty content:**
- Increase timeout: `"timeout": 60`
- Check that Playwright is installed (`playwright install`)

**Cost too high:**
- Switch to `gpt-4o-mini` or Groq for cheaper inference
- Use Ollama for fully local/free operation

## Resources

- Docs: https://docs.scrapegraphai.com
- GitHub: https://github.com/ScrapeGraphAI/Scrapegraph-ai
- Examples: https://github.com/ScrapeGraphAI/ScrapegraphLib-Examples
