// Quick test of Georgian fonts in PDF
const puppeteer = require('puppeteer');

async function testGeorgianPDF() {
  console.log('Testing Georgian PDF generation...');

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

  const html = `
    <!DOCTYPE html>
    <html lang="ka">
    <head>
      <meta charset="UTF-8">
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Georgian:wght@100..900&display=swap" rel="stylesheet">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Georgian:wght@100..900&display=swap');
        
        @font-face {
          font-family: 'GeorgianPDF';
          src: url('https://fonts.gstatic.com/s/notosansgeorgian/v27/PlIaFke5O6RzLfvNNVSioxM2_OTrEhPyDLolKfCsHzC8RrwvsMhh0w.woff2') format('woff2');
          font-weight: 400;
          font-style: normal;
          font-display: block;
        }
        
        body { 
          font-family: 'Noto Sans Georgian', 'GeorgianPDF', system-ui, sans-serif !important; 
          font-size: 16px; 
          padding: 20px;
        }
        
        .test { 
          margin: 10px 0; 
          padding: 10px; 
          border: 1px solid #ccc; 
        }
      </style>
    </head>
    <body>
      <h1>ქართული ფონტის ტესტი</h1>
      
      <div class="test">
        <h3>ქართული ალფავიტი:</h3>
        <p>აბგდევზთიკლმნოპჟრსტუფქღყშჩცძწჭხჯჰ</p>
        <p>ᲐᲑᲒᲓᲔᲕᲖᲗᲘᲙᲚᲛᲜᲝᲞᲟᲠᲡᲢᲣᲤᲥᲦᲧᲨᲩᲪᲫᲬᲭᲮᲯᲰ</p>
      </div>
      
      <div class="test">
        <h3>ტესტი ტექსტი:</h3>
        <p>მე ვარ ქართველი, ამიტომ ვარ ქართველი</p>
        <p>რისკის შეფასების ფორმა №1</p>
        <p>საფრთხეების იდენტიფიკაცია და ღონისძიებები</p>
      </div>
      
      <div class="test">
        <h3>რიცხვები და სიმბოლოები:</h3>
        <p>123456789 ₾ ლარი</p>
        <p>English text for comparison</p>
      </div>
    </body>
    </html>
  `;

  await page.setContent(html, { waitUntil: 'networkidle0' });

  // Wait for fonts to load
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // Generate PDF
  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' },
  });

  // Save PDF
  require('fs').writeFileSync('georgian-test.pdf', pdfBuffer);
  console.log('PDF saved as georgian-test.pdf');

  await browser.close();
}

testGeorgianPDF().catch(console.error);
