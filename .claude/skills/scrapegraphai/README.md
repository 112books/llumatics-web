# scrapegraphai skill

AI-powered web scraping with ScrapeGraphAI — extract structured data from any website using natural language prompts, no CSS selectors needed.

## Trigger

Use this skill when you want to:
- Scrape a website and extract structured data
- Monitor a webpage for changes
- Extract product prices, article content, contact info, etc.
- Build a reusable Python scraper
- Scrape JS-rendered or dynamic pages

## Examples

- "Scrape this product page and give me name, price, and stock status"
- "Extract all articles from this news site as a list"
- "Search for top Python scraping libraries and compare them"
- "Generate a reusable scraper script for this e-commerce site"

## Installation

```bash
pip install scrapegraphai
playwright install
```

## Key features

- Multiple graph types: SmartScraperGraph, SearchGraph, ScriptCreatorGraph, etc.
- Supports OpenAI, Anthropic, Groq, Ollama (local), and more
- Pydantic schema validation for typed structured output
- CLI tool: `just-scrape` for one-off scraping without Python
