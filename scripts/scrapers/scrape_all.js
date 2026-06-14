const { JSDOM } = require("jsdom");
const fs = require("fs");

async function fetchStotram(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.log(`Failed to fetch ${url} - Status ${response.status}`);
      return null;
    }
    const html = await response.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    const contentDiv = document.querySelector('.entry-content');
    if (!contentDiv) return null;

    let text = "";
    contentDiv.childNodes.forEach(node => {
      if (node.nodeName === 'P') {
        let pText = node.innerHTML.replace(/<br\s*[\/]?>/gi, '\n').replace(/<[^>]+>/g, '').trim();
        if (pText) {
          text += pText + "\n\n";
        }
      }
    });
    
    text = text.replace(/&nbsp;/g, ' ').replace(/(\n\s*){3,}/g, '\n\n').trim();
    text = text.replace(/^\(గమనిక:[^\)]+\)\n*/g, ''); // Remove header notes
    
    if (text.length > 50) return text;
    return null;
  } catch (error) {
    console.error("Error fetching", url, error);
    return null;
  }
}

const deities = [
  { id: 'shiva', sahasranama: 'sri-siva-sahasranama-stotram-in-telugu', ashtotharam: 'sri-siva-ashtottara-shatanamavali-in-telugu' },
  { id: 'vishnu', sahasranama: 'sri-vishnu-sahasranama-stotram-in-telugu', ashtotharam: 'sri-vishnu-ashtottara-shatanamavali-in-telugu' },
  { id: 'rama', sahasranama: 'sri-rama-sahasranama-stotram-in-telugu', ashtotharam: 'sri-rama-ashtottara-shatanamavali-in-telugu' },
  { id: 'hanuman', sahasranama: 'sri-hanumat-sahasranama-stotram-in-telugu', ashtotharam: 'sri-hanumat-ashtottara-shatanamavali-in-telugu' },
  { id: 'lalitha', sahasranama: 'sri-lalita-sahasranama-stotram-in-telugu', ashtotharam: 'sri-lalita-ashtottara-shatanamavali-in-telugu' },
  { id: 'lakshmi', sahasranama: 'sri-lakshmi-sahasranama-stotram-in-telugu', ashtotharam: 'sri-lakshmi-ashtottara-shatanamavali-in-telugu' },
  { id: 'saraswati', sahasranama: 'sri-saraswati-sahasranama-stotram-in-telugu', ashtotharam: 'sri-saraswati-ashtottara-shatanamavali-in-telugu' },
  { id: 'durga', sahasranama: 'sri-durga-sahasranama-stotram-in-telugu', ashtotharam: 'sri-durga-ashtottara-shatanamavali-in-telugu' }
];

async function run() {
  let tsCode = fs.readFileSync('src/features/reading/data/stotrams.ts', 'utf8');
  let updated = false;

  for (const deity of deities) {
    console.log(`Fetching ${deity.id}...`);
    const s = await fetchStotram(`https://stotranidhi.com/te/${deity.sahasranama}/`);
    const a = await fetchStotram(`https://stotranidhi.com/te/${deity.ashtotharam}/`);

    if (s && a) {
      console.log(`Success for ${deity.id}!`);
      
      const safeS = s.replace(/`/g, '\\`').replace(/\$/g, '\\$');
      const safeA = a.replace(/`/g, '\\`').replace(/\$/g, '\\$');
      
      // We will construct regex dynamically for each deity to replace their block.
      // E.g., for shiva: ashtotharam: `ఓం శివాయ నమః[^`]+`
      
      let ashRegex = new RegExp(`ashtotharam:\\s*\`[^\`]*?108 names placeholder for ${deity.id.charAt(0).toUpperCase() + deity.id.slice(1)}[^\`]*\``, 'i');
      let sahRegex = new RegExp(`sahasranamam:\\s*\`[^\`]*?1000 names placeholder for ${deity.id.charAt(0).toUpperCase() + deity.id.slice(1)}[^\`]*\``, 'i');
      
      // If the specific placeholder pattern fails, we can just replace everything between backticks after the key
      if (!ashRegex.test(tsCode)) {
        ashRegex = new RegExp(`(id:\\s*'${deity.id}'[\\s\\S]*?ashtotharam:\\s*)\`[^\`]+\``);
        tsCode = tsCode.replace(ashRegex, `$1\`${safeA}\``);
      } else {
        tsCode = tsCode.replace(ashRegex, `ashtotharam: \`${safeA}\``);
      }

      if (!sahRegex.test(tsCode)) {
        sahRegex = new RegExp(`(id:\\s*'${deity.id}'[\\s\\S]*?sahasranamam:\\s*)\`[^\`]+\``);
        tsCode = tsCode.replace(sahRegex, `$1\`${safeS}\``);
      } else {
        tsCode = tsCode.replace(sahRegex, `sahasranamam: \`${safeS}\``);
      }

      updated = true;
    } else {
      console.log(`Failed for ${deity.id}.`);
    }
  }

  if (updated) {
    fs.writeFileSync('src/features/reading/data/stotrams.ts', tsCode);
    console.log("All done!");
  }
}

run();
