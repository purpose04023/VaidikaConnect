import fs from 'fs';
import path from 'path';

const poojasDir = path.resolve(process.cwd(), 'public', 'images', 'poojas');

async function main() {
  if (!fs.existsSync(poojasDir)) {
    console.error(`Directory not found: ${poojasDir}`);
    return;
  }

  const files = fs.readdirSync(poojasDir).filter(f => f.endsWith('.svg'));
  console.log(`Found ${files.length} SVG files to check.`);

  let fixedCount = 0;

  for (const file of files) {
    const filepath = path.join(poojasDir, file);
    let content = fs.readFileSync(filepath, 'utf8');

    // Check if the SVG tag contains xmlns attribute
    const svgTagMatch = content.match(/<svg([^>]*)>/);
    if (svgTagMatch) {
      const svgTag = svgTagMatch[0];
      if (!svgTag.includes('xmlns=')) {
        // We need to inject xmlns="http://www.w3.org/2000/svg"
        const updatedSvgTag = svgTag.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
        content = content.replace(svgTag, updatedSvgTag);
        
        fs.writeFileSync(filepath, content, 'utf8');
        console.log(`✅ Fixed namespace in: ${file}`);
        fixedCount++;
      }
    }
  }

  console.log(`🎉 Completed! Fixed ${fixedCount} SVG files.`);
}

main().catch(console.error);
