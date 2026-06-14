const { JSDOM } = require("jsdom");
const fs = require("fs");

async function fetchStotram(url) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    // Stotranidhi usually puts the main text inside `.entry-content`
    const contentDiv = document.querySelector('.entry-content');
    if (!contentDiv) return "Content not found";

    // Extract paragraphs and break tags properly
    let text = "";
    contentDiv.childNodes.forEach(node => {
      if (node.nodeName === 'P') {
        let pText = node.innerHTML.replace(/<br\s*[\/]?>/gi, '\n').replace(/<[^>]+>/g, '').trim();
        if (pText) {
          text += pText + "\n\n";
        }
      }
    });
    
    // Clean up
    text = text.replace(/&nbsp;/g, ' ').replace(/(\n\s*){3,}/g, '\n\n').trim();
    // Remove the note at the beginning if present "(గమనిక:...)"
    text = text.replace(/^\(గమనిక:[^\)]+\)\n*/g, '');
    
    return text;
  } catch (error) {
    console.error("Error fetching", url, error);
    return "";
  }
}

async function run() {
  const sahasranamam = await fetchStotram("https://stotranidhi.com/te/sri-maha-ganapati-sahasranama-stotram-in-telugu/");
  const ashtotharam = await fetchStotram("https://stotranidhi.com/te/sri-maha-ganapati-sahasranamavali-in-telugu/");
  
  if (sahasranamam && ashtotharam) {
    let tsCode = fs.readFileSync('src/features/reading/data/stotrams.ts', 'utf8');
    
    // Escape backticks and dollars
    const safeSahasranamam = sahasranamam.replace(/`/g, '\\`').replace(/\$/g, '\\$');
    const safeAshtotharam = ashtotharam.replace(/`/g, '\\`').replace(/\$/g, '\\$');
    
    // Replace in the file for ganesha
    tsCode = tsCode.replace(/ashtotharam: `ఓం గజాననాయ నమః[^`]+`/g, `ashtotharam: \`${safeAshtotharam}\``);
    tsCode = tsCode.replace(/sahasranamam: `శ్రీ గణేశ సహస్రనామ స్తోత్రం[^`]+`/g, `sahasranamam: \`${safeSahasranamam}\``);
    
    fs.writeFileSync('src/features/reading/data/stotrams.ts', tsCode);
    console.log("Successfully scraped and updated Ganesha stotrams.");
  } else {
    console.log("Failed to scrape text.");
  }
}

run();
