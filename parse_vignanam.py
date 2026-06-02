import re
import json

content_path = r"C:\Users\sudheendra-sripada\.gemini\antigravity\brain\fc8a9c43-bb56-4c81-9522-82df086a6afb\.system_generated\steps\1091\content.md"

with open(content_path, "r", encoding="utf-8") as f:
    text = f.read()

# The tree starts at `<ul class="aqtree3clickable">`
# Let's extract everything inside this ul block.
start_idx = text.find('<ul class="aqtree3clickable">')
if start_idx == -1:
    print("Could not find tree start")
    exit(1)

# Find the matching closing ul for the main tree
end_idx = text.find('</ul>\n									</section>', start_idx)

if end_idx == -1:
    # Alternative fallback if strict match fails
    end_idx = text.find('</section>', start_idx)

tree_html = text[start_idx:end_idx]

# Parse Categories
# A category looks like:
# <li><img src="..." /><a class="link1" href="">నిత్య పారాయణ శ్లోకాః (26)</a>
# <ul> ... items ... </ul>
# </li>

categories = []

category_blocks = re.findall(r'<li><img.*?/><a class="link1" href="">(.*?)</a>\s*<ul>(.*?)</ul>\s*</li>', tree_html, re.DOTALL)

for cat_name_raw, items_html in category_blocks:
    # clean category name: remove non-breaking spaces and the count e.g. "నిత్య పారాయణ శ్లోకాః (26)"
    cat_name = cat_name_raw.replace('&nbsp;', ' ').strip()
    
    # Extract items
    # <li><a class="link4" href="telugu/ganapati-prarthana-ghanapatham.html">గణపతి ప్రార్థన ఘనపాఠః</a></li>
    items = []
    item_matches = re.findall(r'<li><a class="link4" href="(.*?)">(.*?)</a></li>', items_html)
    
    for href, title_raw in item_matches:
        title = title_raw.replace('&nbsp;', ' ').strip()
        items.append({
            "title": title,
            "url": f"https://www.vignanam.org/{href}"
        })
        
    categories.append({
        "category": cat_name,
        "items": items
    })

output_path = r"src\lib\data\vignanam-categories.json"
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(categories, f, ensure_ascii=False, indent=2)

print(f"Successfully extracted {len(categories)} categories to {output_path}")
