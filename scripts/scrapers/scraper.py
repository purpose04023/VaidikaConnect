import urllib.request
import json
from bs4 import BeautifulSoup
import re

urls = {
  'shiva_s': 'https://vignanam.org/telugu/sri-siva-sahasranama-stotram.html',
  'shiva_a': 'https://vignanam.org/telugu/sri-siva-ashtottara-shatanamavali.html',
  'vishnu_s': 'https://vignanam.org/telugu/sri-vishnu-sahasranama-stotram.html',
  'vishnu_a': 'https://vignanam.org/telugu/sri-vishnu-ashtottara-shatanamavali.html',
}

req_headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5'
}

def fetch_text(url):
    try:
        req = urllib.request.Request(url, headers=req_headers)
        with urllib.request.urlopen(req) as response:
            html = response.read().decode('utf-8')
            soup = BeautifulSoup(html, 'html.parser')
            # Vignanam puts stotram text in a div with id 'stotram' or 'stotramText'
            content = soup.find('div', id='stotramText') or soup.find('div', class_='stotramText')
            if not content:
                # Try finding any big chunk of telugu text
                content = soup.find('body')
            
            # Extract text preserving line breaks
            lines = []
            for child in content.descendants:
                if isinstance(child, str):
                    lines.append(child)
                elif child.name == 'br':
                    lines.append('\n')
            
            text = "".join(lines)
            text = re.sub(r'(\n\s*){3,}', '\n\n', text).strip()
            return text if len(text) > 100 else None
    except Exception as e:
        print(f"Failed for {url}: {e}")
        return None

print("Starting fetch from vignanam.org...")
for name, url in urls.items():
    text = fetch_text(url)
    if text:
        with open(f"{name}.txt", "w", encoding="utf-8") as f:
            f.write(text)
        print(f"Saved {name}")
