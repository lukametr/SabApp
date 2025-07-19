// This file tests font availability in the system
const puppeteer = require('puppeteer');

async function testFonts() {
  console.log('Testing Georgian font support...');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process',
      '--disable-gpu',
      '--lang=ka-GE',
      '--accept-lang=ka-GE,ka,en-US,en',
    ],
  });

  const page = await browser.newPage();

  // Test Georgian text rendering
  const georgianText = 'ქართული ტექსტი ღირებულებებით: ₾ ლარი';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { 
          font-family: 'Noto Sans Georgian', 'DejaVu Sans', 'Liberation Sans', Arial, sans-serif; 
          font-size: 16px;
        }
        .test { margin: 10px; padding: 10px; border: 1px solid #ccc; }
      </style>
    </head>
    <body>
      <div class="test">
        <h3>Georgian Text Test:</h3>
        <p>${georgianText}</p>
        <p>English text for comparison</p>
      </div>
    </body>
    </html>
  `;

  await page.setContent(html);

  // Check available fonts
  const fonts = await page.evaluate(() => {
    const div = document.createElement('div');
    div.style.fontFamily = 'monospace';
    div.style.fontSize = '72px';
    div.innerHTML = 'mmmmmmmmmmlli';
    document.body.appendChild(div);
    const monoWidth = div.offsetWidth;

    const testFonts = [
      'Noto Sans Georgian',
      'DejaVu Sans',
      'Liberation Sans',
      'Arial',
      'Times New Roman',
    ];

    const availableFonts = [];

    testFonts.forEach((font) => {
      div.style.fontFamily = font + ', monospace';
      if (div.offsetWidth !== monoWidth) {
        availableFonts.push(font);
      }
    });

    document.body.removeChild(div);
    return availableFonts;
  });

  console.log('Available fonts:', fonts);

  // Take screenshot
  await page.screenshot({
    path: 'font-test.png',
    fullPage: true,
  });

  console.log('Screenshot saved as font-test.png');

  await browser.close();
}

testFonts().catch(console.error);
