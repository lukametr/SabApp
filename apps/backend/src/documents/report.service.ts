import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import * as puppeteer from 'puppeteer';
import { existsSync } from 'fs';

@Injectable()
export class ReportService {
  
  /**
   * დოკუმენტის Excel ფაილის შექმნა
   */
  async generateExcelReport(document: any): Promise<Buffer> {
    // --- ძველი ვარიანტი ---
    /*
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('უსაფრთხოების შეფასება');

    // სათაური
    worksheet.mergeCells('A1:F1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = 'უსაფრთხოების შეფასების დოკუმენტი';
    titleCell.font = { size: 16, bold: true };
    titleCell.alignment = { horizontal: 'center' };
    titleCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4472C4' }
    };

    // ძირითადი ინფორმაცია
    let row = 3;
    const basicInfo = [
      ['შემფასებლის სახელი:', `${document.evaluatorName} ${document.evaluatorLastName}`],
      ['ობიექტის დასახელება:', document.objectName],
      ['სამუშაოს აღწერა:', document.workDescription],
      ['თარიღი:', new Date(document.date).toLocaleDateString('ka-GE')],
      ['დრო:', new Date(document.time).toLocaleTimeString('ka-GE')],
      ['საფრთხეების რაოდენობა:', document.hazards?.length || 0],
      ['ფოტოების რაოდენობა:', (document.photos?.length || 0) + (document.hazards?.reduce((sum: number, h: any) => sum + (h.photos?.length || 0), 0) || 0)]
    ];

    basicInfo.forEach(([label, value]) => {
      worksheet.getCell(`A${row}`).value = label;
      worksheet.getCell(`A${row}`).font = { bold: true };
      worksheet.getCell(`B${row}`).value = value;
      row++;
    });

    // საფრთხეების ცხრილი
    if (document.hazards && document.hazards.length > 0) {
      row += 2;
      worksheet.getCell(`A${row}`).value = 'იდენტიფიცირებული საფრთხეები';
      worksheet.getCell(`A${row}`).font = { size: 14, bold: true };
      row++;

      // ცხრილის თავსართი
      const headers = ['#', 'საფრთხე', 'ალბათობა', 'მნიშვნელობა', 'რისკი (საწყისი)', 'რისკი (ნარჩენი)', 'ღონისძიება'];
      headers.forEach((header, index) => {
        const cell = worksheet.getCell(row, index + 1);
        cell.value = header;
        cell.font = { bold: true };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'E7E6E6' }
        };
      });
      row++;

      // საფრთხეების დანამატი
      document.hazards.forEach((hazard: any, index: number) => {
        const hazardRow = [
          index + 1,
          hazard.hazard || 'N/A',
          hazard.probability || 'N/A',
          hazard.severity || 'N/A',
          hazard.initialRisk || 'N/A',
          hazard.residualRisk || 'N/A',
          hazard.preventiveMeasure || 'N/A'
        ];

        hazardRow.forEach((value, colIndex) => {
          worksheet.getCell(row, colIndex + 1).value = value;
        });
        row++;
      });
    }

    // სვეტების ზომის რეგულირება
    worksheet.columns.forEach(column => {
      column.width = 15;
    });
    worksheet.getColumn(2).width = 25; // საფრთხის აღწერა უფრო ფართო
    worksheet.getColumn(7).width = 30; // ღონისძიება უფრო ფართო

    // ფაილის გენერაცია
    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
    */

    // --- ახალი ვარიანტი ---
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('ფორმა №1');

    // 1. Header Data (ზედა ნაწილი)
    const evaluatorName = `${document.evaluatorName || ''} ${document.evaluatorLastName || ''}`.trim();
    const objectName = document.objectName || '';
    const workDescription = document.workDescription || '';
    const date = document.date ? new Date(document.date).toLocaleDateString('ka-GE') : '';
    const time = document.time ? new Date(document.time).toLocaleTimeString('ka-GE') : '';

    const headerData = [
      ['რისკის შეფასების ფორმა №1', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['შეფასებლის სახელი და გვარი:', evaluatorName, '', '', '', '', '', '', '', '', 'თარიღი:', date, '', '', '', '', ''],
      ['სამუშაო ობიექტის დასახელება:', objectName, '', '', '', '', '', '', '', '', 'დრო:', time, '', '', '', '', ''],
      ['სამუშაოს დაწყების თარიღი:', workDescription, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']
    ];

    // 2. ცხრილის სათაურები - 13 მთავარი ჰედერი + 4 დამატებითი = 17 სვეტი
    const tableHeaders = [
      [
        'საფრთხე და იდენტიფიკაცია',
        'არსებული ფოტო/ვიდეო მასალა',
        'პოტენციურად დაზარალებული პირები',
        'ტრავმის ხასიათი',
        'მიმდინარე კონტროლის ღონისძიებები',
        'საწყისი რისკი',
        'ალბათობა',
        'სიმძიმე',
        'ნამრავლი',
        'დამატებითი კონტროლის ღონისძიებები',
        'ნარჩენი რისკი',
        'ალბათობა',
        'სიმძიმე',
        'ნამრავლი',
        'საჭირო ღონისძიებები',
        'შესრულებაზე პასუხისმგებელი პირი',
        'გადახედვის სავარაუდო თარიღი',
      ]
    ];

    // 3. ცხრილის მონაცემები (hazards) - 17 სვეტი
    const hazards = Array.isArray(document.hazards) ? document.hazards : [];
    const tableRows = hazards.length > 0
      ? hazards.map((hazard: any) => [
          hazard.hazardIdentification || '',  // სწორი ველი
          hazard.photos?.join(', ') || '',    // photos array
          hazard.affectedPersons?.join(', ') || '',  // persons array
          hazard.injuryDescription || '',     // injury description
          hazard.existingControlMeasures || '',  // სწორი ველი
          hazard.initialRisk?.total || '',    // საწყისი რისკი (მთავარი)
          hazard.initialRisk?.probability || '',    // ალბათობა
          hazard.initialRisk?.severity || '',       // სიმძიმე
          hazard.initialRisk?.total || '',          // ნამრავლი (გამეორება მთავარისა)
          hazard.additionalControlMeasures || '',  // სწორი ველი
          hazard.residualRisk?.total || '',   // ნარჩენი რისკი (მთავარი)
          hazard.residualRisk?.probability || '',   // ალბათობა
          hazard.residualRisk?.severity || '',      // სიმძიმე
          hazard.residualRisk?.total || '',         // ნამრავლი (გამეორება მთავარისა)
          hazard.requiredMeasures || '',      // სწორი ველი
          hazard.responsiblePerson || '',     // ეს სწორია
          hazard.reviewDate ? new Date(hazard.reviewDate).toLocaleDateString('ka-GE') : ''  // review date
        ])
      : Array(5).fill(null).map(() => Array(tableHeaders[0].length).fill(''));

    // 4. ყველა ერთად
    const fullSheetData = [
      ...headerData,
      [],
      ...tableHeaders,
      ...tableRows
    ];

    // 5. Worksheet-ში ჩასმა
    worksheet.addRows(fullSheetData);

    // 6. Merge-ები
    worksheet.mergeCells('A1:Q1'); // სათაური spans all 17 columns
    worksheet.mergeCells('B2:J2'); // შეფასებლის სახელი
    worksheet.mergeCells('K2:K2'); // თარიღი
    worksheet.mergeCells('B3:J3'); // ობიექტი
    worksheet.mergeCells('K3:K3'); // დრო
    worksheet.mergeCells('B4:Q4'); // სამუშაოს აღწერა spans all columns
    
    // Table header merges - ყველა სვეტი ცალკეა, merge არ არის საჭირო
    
    // სვეტების სიგანის მორგება - 17 სვეტი
    worksheet.columns = [
      { width: 25 }, // A - საფრთხე და იდენტიფიკაცია
      { width: 20 }, // B - ფოტო
      { width: 25 }, // C - პოტენციურად დაზარალებული პირები
      { width: 20 }, // D - ტრავმის ხასიათი
      { width: 25 }, // E - მიმდინარე კონტროლის ღონისძიებები
      { width: 15 }, // F - საწყისი რისკი (მთავარი)
      { width: 12 }, // G - ალბათობა
      { width: 12 }, // H - სიმძიმე
      { width: 12 }, // I - ნამრავლი
      { width: 25 }, // J - დამატებითი კონტროლის ღონისძიებები
      { width: 15 }, // K - ნარჩენი რისკი (მთავარი)
      { width: 12 }, // L - ალბათობა
      { width: 12 }, // M - სიმძიმე
      { width: 12 }, // N - ნამრავლი
      { width: 25 }, // O - საჭირო ღონისძიებები
      { width: 25 }, // P - შესრულებაზე პასუხისმგებელი პირი
      { width: 20 }, // Q - გადახედვის სავარაუდო თარიღი
    ];

    // 8. სტილები (სათაური და table header)
    // სათაური
    const titleCell = worksheet.getCell('A1');
    titleCell.font = { size: 16, bold: true };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    titleCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4472C4' }
    };
    titleCell.font = { color: { argb: 'FFFFFF' }, size: 16, bold: true };

    // Table Header სტილი
    const headerRowIdx = headerData.length + 2; // e.g. 4+2=6
    const headerRow = worksheet.getRow(headerRowIdx);
    headerRow.eachCell(cell => {
      cell.font = { bold: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'E7E6E6' }
      };
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    });

    // ცხრილის სხეულის სტილი
    const dataStartRow = headerRowIdx + 1;
    for (let i = dataStartRow; i <= dataStartRow + tableRows.length; i++) {
      const row = worksheet.getRow(i);
      row.eachCell(cell => {
        cell.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    }

    // 9. ფაილის გენერაცია
    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  /**
   * დოკუმენტის PDF ფაილის შექმნა
   */
  async generatePDFReport(document: any): Promise<Buffer> {
    let browser = null;
    
    try {
      console.log('📄 Starting PDF generation for document:', document._id || 'unknown');
      const html = this.generateHTMLReport(document);
      
      // Production-ისთვის Chrome executable path და arguments
      const isProduction = process.env.NODE_ENV === 'production';
      const isRailway = process.env.RAILWAY_ENVIRONMENT || process.env.RAILWAY_PROJECT_ID;
      
      console.log('🔍 Environment check:', { isProduction, isRailway, nodeEnv: process.env.NODE_ENV });
      
      const browserOptions: any = { 
        headless: 'new',
        timeout: 60000, // 60 seconds timeout
        args: [
          '--no-sandbox', 
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu',
          '--disable-background-timer-throttling',
          '--disable-backgrounding-occluded-windows',
          '--disable-renderer-backgrounding',
          '--disable-features=TranslateUI',
          '--disable-ipc-flooding-protection',
          '--memory-pressure-off',
          '--font-render-hinting=none',
          '--enable-font-antialiasing',
          '--disable-font-subpixel-positioning'
        ]
      };

      // Production environment-ისთვის additional args
      if (isProduction || isRailway) {
        browserOptions.args.push('--single-process');
        browserOptions.args.push('--max_old_space_size=512');
        
        // Railway/Render-ისთვის Chrome path
        const possiblePaths = [
          process.env.PUPPETEER_EXECUTABLE_PATH,
          process.env.CHROME_BIN,
          '/usr/bin/google-chrome-stable',
          '/usr/bin/google-chrome',
          '/usr/bin/chromium-browser',
          '/usr/bin/chromium',
          '/opt/render/project/src/.chrome/chrome', // Render specific
          '/app/.apt/usr/bin/google-chrome-stable'  // Heroku/Railway
        ].filter(Boolean);
        
        console.log('🔍 Checking possible Chrome paths:', possiblePaths);
        
        // რეალური ფაილის არსებობის შემოწმება
        let chromiumPath = null;
        for (const path of possiblePaths) {
          if (path && existsSync(path)) {
            chromiumPath = path;
            console.log('✅ Found Chrome at:', path);
            break;
          } else if (path) {
            console.log('❌ Chrome not found at:', path);
          }
        }
        
        if (chromiumPath) {
          browserOptions.executablePath = chromiumPath;
        } else {
          console.log('⚠️ No Chrome executable found, using default Puppeteer');
        }
      }
      
      console.log('🚀 Launching Puppeteer with options:', JSON.stringify(browserOptions, null, 2));
      browser = await puppeteer.launch(browserOptions);
      
      try {
        console.log('🌐 Creating new page...');
        const page = await browser.newPage();
        
        // Set viewport for consistent rendering
        await page.setViewport({ width: 1200, height: 800 });
        
        // ქართული ფონტების მხარდაჭერისთვის - local fonts
        await page.evaluateOnNewDocument(() => {
          const style = document.createElement('style');
          style.textContent = `
            @font-face {
              font-family: 'Georgian';
              src: local('BPG Arial'),
                   local('BPG Nino Medium'),
                   local('Sylfaen'),
                   local('DejaVu Sans'),
                   local('Arial Unicode MS'),
                   local('Lucida Sans Unicode');
              unicode-range: U+10A0-10FF; /* Georgian Unicode range */
            }
          `;
          document.head.appendChild(style);
        });
        
        console.log('📝 Setting page content...');
        
        // Try simplified HTML first for better PDF compatibility
        const isSimplified = true; // Toggle for testing
        const htmlContent = isSimplified ? this.generateSimplifiedHTMLReport(document) : html;
        
        await page.setContent(htmlContent, { 
          waitUntil: 'networkidle0',
          timeout: 30000 
        });
        
        // ფონტების ჩატვირთვის მოლოდინი და ქართული ტექსტის ტესტი
        console.log('⏳ Testing Georgian font rendering...');
        
        // Test Georgian text rendering
        await page.evaluate(() => {
          // Create a test element to verify Georgian font loading
          const testDiv = document.createElement('div');
          testDiv.textContent = 'ქართული ტექსტი';
          testDiv.style.fontFamily = 'Georgian, BPG Arial, Sylfaen, Arial';
          testDiv.style.position = 'absolute';
          testDiv.style.top = '-9999px';
          document.body.appendChild(testDiv);
          
          // Force reflow
          testDiv.offsetHeight;
          
          document.body.removeChild(testDiv);
        });
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log('📄 Generating PDF...');
        
        // First try with standard options
        let pdfBuffer;
        try {
          pdfBuffer = await page.pdf({
            format: 'A4',
            landscape: false, // Portrait ორიენტაცია stability-ისთვის
            printBackground: true,
            width: '297mm', // A4 width
            height: '210mm', // A4 height landscape equivalent
            margin: {
              top: '5mm',
              right: '5mm', 
              bottom: '5mm',
              left: '5mm'
            },
            displayHeaderFooter: false,
            timeout: 60000, // 60 second timeout
            scale: 0.8 // Scale down content to fit better
          });
        } catch (pdfError) {
          console.log('⚠️ First PDF attempt failed, trying fallback options...');
          
          // Fallback with minimal options
          pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: false, // Disable background printing
            margin: {
              top: '10mm',
              right: '10mm',
              bottom: '10mm', 
              left: '10mm'
            },
            timeout: 90000
          });
        }
        
        console.log('✅ PDF generated successfully, size:', pdfBuffer.length, 'bytes');
        return Buffer.from(pdfBuffer);
        
      } catch (pageError) {
        console.error('❌ Page/PDF Generation Error:', pageError);
        throw pageError;
      } finally {
        if (browser) {
          console.log('🔄 Closing browser...');
          await browser.close();
        }
      }
      
    } catch (error) {
      console.error('❌ PDF Generation Error:', error);
      console.error('🔍 Error stack:', error.stack);
      console.error('🔍 Environment details:', {
        NODE_ENV: process.env.NODE_ENV,
        RAILWAY_ENVIRONMENT: process.env.RAILWAY_ENVIRONMENT,
        PUPPETEER_EXECUTABLE_PATH: process.env.PUPPETEER_EXECUTABLE_PATH,
        CHROME_BIN: process.env.CHROME_BIN,
        platform: process.platform,
        arch: process.arch
      });
      
      // Fallback error message
      const errorMessage = error.message?.includes('Error: Failed to launch')
        ? 'PDF სერვისი დროებით მიუწვდომელია. გთხოვთ, სცადოთ მოგვიანებით.'
        : `PDF გენერაცია ვერ მოხერხდა: ${error.message}`;
        
      throw new Error(errorMessage);
    }
  }

  /**
   * HTML რეპორტის შექმნა
   */
  private generateHTMLReport(document: any): string {
    // ძირითადი ინფორმაცია
    const evaluatorName = `${document.evaluatorName || ''} ${document.evaluatorLastName || ''}`.trim();
    const objectName = document.objectName || '';
    const workDescription = document.workDescription || '';
    const date = document.date ? new Date(document.date).toLocaleDateString('ka-GE') : '';
    const time = document.time ? new Date(document.time).toLocaleTimeString('ka-GE') : '';

    // საფრთხეების ცხრილი - 17 სვეტი (Excel-ის მსგავსი)
    const hazards = Array.isArray(document.hazards) ? document.hazards : [];
    const hazardsHTML = hazards.length > 0
      ? hazards.map((hazard: any, index: number) => `
          <tr>
            <td>${index + 1}</td>
            <td>${hazard.hazardIdentification || ''}</td>
            <td>${hazard.photos?.join(', ') || ''}</td>
            <td>${hazard.affectedPersons?.join(', ') || ''}</td>
            <td>${hazard.injuryDescription || ''}</td>
            <td>${hazard.existingControlMeasures || ''}</td>
            <td>${hazard.initialRisk?.total || ''}</td>
            <td>${hazard.initialRisk?.probability || ''}</td>
            <td>${hazard.initialRisk?.severity || ''}</td>
            <td>${hazard.initialRisk?.total || ''}</td>
            <td>${hazard.additionalControlMeasures || ''}</td>
            <td>${hazard.residualRisk?.total || ''}</td>
            <td>${hazard.residualRisk?.probability || ''}</td>
            <td>${hazard.residualRisk?.severity || ''}</td>
            <td>${hazard.residualRisk?.total || ''}</td>
            <td>${hazard.requiredMeasures || ''}</td>
            <td>${hazard.responsiblePerson || ''}</td>
            <td>${hazard.reviewDate ? new Date(hazard.reviewDate).toLocaleDateString('ka-GE') : ''}</td>
          </tr>
        `).join('')
      : '<tr><td colspan="18">საფრთხეები არ იქნა იდენტიფიცირებული</td></tr>';

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>რისკის შეფასების ფორმა №1</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Georgian:wght@400;700&display=swap');
            
            body { 
              font-family: 'Georgian', 'BPG Arial', 'BPG Nino Medium', 'Sylfaen', 'DejaVu Sans', 'Arial Unicode MS', 'Lucida Sans Unicode', Arial, sans-serif; 
              font-size: 8px; 
              line-height: 1.1;
            }
            
            .header { 
              text-align: center; 
              background: #4472C4; 
              color: white; 
              padding: 10px; 
              margin-bottom: 15px; 
              font-size: 12px;
              font-weight: bold;
            }
            
            .info-section { 
              margin-bottom: 15px; 
            }
            
            .info-table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-bottom: 10px;
            }
            
            .info-table td { 
              padding: 3px; 
              border: 1px solid #ddd; 
              font-size: 7px;
            }
            
            .info-table td:first-child { 
              background: #f5f5f5; 
              font-weight: bold; 
              width: 20%; 
            }
            
            .hazards-table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-top: 10px; 
              font-size: 6px;
              table-layout: auto;
            }
            
            .hazards-table th, .hazards-table td { 
              padding: 2px; 
              border: 1px solid #333; 
              text-align: center; 
              vertical-align: top;
              word-wrap: break-word;
              overflow-wrap: break-word;
              max-width: 60px;
            }
            
            .hazards-table th { 
              background: #E7E6E6; 
              font-weight: bold; 
              font-size: 5px;
              line-height: 1.0;
            }
            
            .hazards-table td { 
              text-align: left; 
              font-size: 5px;
            }
            
            .section-title { 
              font-size: 10px; 
              font-weight: bold; 
              margin: 10px 0 5px 0; 
            }
            
            @page {
              size: A4 portrait;
              margin: 5mm;
            }
            
            @media print {
              body { 
                font-size: 6px; 
                margin: 0;
              }
              .hazards-table { 
                font-size: 5px; 
              }
              .hazards-table th { 
                font-size: 4px; 
              }
              .header {
                font-size: 10px;
                padding: 5px;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            რისკის შეფასების ფორმა №1
          </div>
          
          <div class="info-section">
            <table class="info-table">
              <tr>
                <td>შეფასებლის სახელი და გვარი:</td>
                <td>${evaluatorName}</td>
                <td>თარიღი:</td>
                <td>${date}</td>
              </tr>
              <tr>
                <td>სამუშაო ობიექტის დასახელება:</td>
                <td>${objectName}</td>
                <td>დრო:</td>
                <td>${time}</td>
              </tr>
              <tr>
                <td>სამუშაოს დაწყების თარიღი:</td>
                <td colspan="3">${workDescription}</td>
              </tr>
            </table>
          </div>
          
          <div class="hazards-section">
            <table class="hazards-table">
              <thead>
                <tr>
                  <th>№</th>
                  <th>საფრთხე და იდენტიფიკაცია</th>
                  <th>არსებული ფოტო/ვიდეო მასალა</th>
                  <th>პოტენციურად დაზარალებული პირები</th>
                  <th>ტრავმის ხასიათი</th>
                  <th>მიმდინარე კონტროლის ღონისძიებები</th>
                  <th>საწყისი რისკი</th>
                  <th>ალბათობა</th>
                  <th>სიმძიმე</th>
                  <th>ნამრავლი</th>
                  <th>დამატებითი კონტროლის ღონისძიებები</th>
                  <th>ნარჩენი რისკი</th>
                  <th>ალბათობა</th>
                  <th>სიმძიმე</th>
                  <th>ნამრავლი</th>
                  <th>საჭირო ღონისძიებები</th>
                  <th>შესრულებაზე პასუხისმგებელი პირი</th>
                  <th>გადახედვის სავარაუდო თარიღი</th>
                </tr>
              </thead>
              <tbody>
                ${hazardsHTML}
              </tbody>
            </table>
          </div>
          
          <div style="margin-top: 30px; text-align: center; font-size: 8px; color: #666;">
            გენერირებულია: ${new Date().toLocaleDateString('ka-GE')} ${new Date().toLocaleTimeString('ka-GE')}
          </div>
        </body>
      </html>
    `;
  }

  /**
   * გამარტივებული HTML რეპორტის შექმნა (PDF-ისთვის უკეთესი თავსებადობა)
   */
  private generateSimplifiedHTMLReport(document: any): string {
    // ძირითადი ინფორმაცია
    const evaluatorName = `${document.evaluatorName || ''} ${document.evaluatorLastName || ''}`.trim();
    const objectName = document.objectName || '';
    const workDescription = document.workDescription || '';
    const date = document.date ? new Date(document.date).toLocaleDateString('ka-GE') : '';
    const time = document.time ? new Date(document.time).toLocaleTimeString('ka-GE') : '';

    // საფრთხეების მონაცემები
    const hazards = Array.isArray(document.hazards) ? document.hazards : [];
    const hazardsHTML = hazards.length > 0
      ? hazards.map((hazard: any, index: number) => `
          <tr>
            <td>${index + 1}</td>
            <td>${hazard.hazardIdentification || ''}</td>
            <td>${hazard.initialRisk?.probability || ''}</td>
            <td>${hazard.initialRisk?.severity || ''}</td>
            <td>${hazard.initialRisk?.total || ''}</td>
            <td>${hazard.residualRisk?.probability || ''}</td>
            <td>${hazard.residualRisk?.severity || ''}</td>
            <td>${hazard.residualRisk?.total || ''}</td>
            <td>${hazard.requiredMeasures || ''}</td>
            <td>${hazard.responsiblePerson || ''}</td>
          </tr>
        `).join('')
      : '<tr><td colspan="10">საფრთხეები არ იქნა იდენტიფიცირებული</td></tr>';

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>რისკის შეფასების ფორმა</title>        <style>
          @font-face {
            font-family: 'Georgian';
            src: local('BPG Arial'),
                 local('BPG Nino Medium'),
                 local('Sylfaen'),
                 local('DejaVu Sans'),
                 local('Arial Unicode MS'),
                 local('Lucida Sans Unicode');
            unicode-range: U+10A0-10FF; /* Georgian Unicode range */
          }
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
                body { 
            font-family: 'Georgian', 'BPG Arial', 'BPG Nino Medium', 'Sylfaen', 'DejaVu Sans', 'Arial Unicode MS', 'Lucida Sans Unicode', Arial, sans-serif; 
            font-size: 10px; 
            line-height: 1.2;
            margin: 10px;
          }
            
            .header { 
              text-align: center; 
              background: #4472C4; 
              color: white; 
              padding: 8px; 
              margin-bottom: 15px; 
              font-size: 14px;
              font-weight: bold;
            }
            
            .info-table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-bottom: 15px;
              font-size: 9px;
            }
            
            .info-table td { 
              padding: 4px; 
              border: 1px solid #333; 
            }
            
            .info-table td:first-child { 
              background: #f0f0f0; 
              font-weight: bold; 
              width: 25%; 
            }
            
            .hazards-table { 
              width: 100%; 
              border-collapse: collapse; 
              font-size: 8px;
            }
            
            .hazards-table th, .hazards-table td { 
              padding: 3px; 
              border: 1px solid #333; 
              text-align: center; 
              vertical-align: top;
            }
            
            .hazards-table th { 
              background: #e0e0e0; 
              font-weight: bold; 
              font-size: 7px;
            }
            
            .hazards-table td { 
              text-align: left; 
              font-size: 7px;
            }
            
            @media print {
              body { font-size: 8px; }
              .hazards-table { font-size: 6px; }
              .hazards-table th { font-size: 5px; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            რისკის შეფასების ფორმა №1
          </div>
          
          <table class="info-table">
            <tr>
              <td>შეფასებლის სახელი და გვარი:</td>
              <td>${evaluatorName}</td>
              <td>თარიღი:</td>
              <td>${date}</td>
            </tr>
            <tr>
              <td>სამუშაო ობიექტის დასახელება:</td>
              <td>${objectName}</td>
              <td>დრო:</td>
              <td>${time}</td>
            </tr>
            <tr>
              <td>სამუშაოს აღწერა:</td>
              <td colspan="3">${workDescription}</td>
            </tr>
          </table>
          
          <table class="hazards-table">
            <thead>
              <tr>
                <th>№</th>
                <th>საფრთხე</th>
                <th>საწყისი ალბათობა</th>
                <th>საწყისი სიმძიმე</th>
                <th>საწყისი რისკი</th>
                <th>ნარჩენი ალბათობა</th>
                <th>ნარჩენი სიმძიმე</th>
                <th>ნარჩენი რისკი</th>
                <th>საჭირო ღონისძიებები</th>
                <th>პასუხისმგებელი</th>
              </tr>
            </thead>
            <tbody>
              ${hazardsHTML}
            </tbody>
          </table>
          
          <div style="margin-top: 20px; text-align: center; font-size: 8px; color: #666;">
            გენერირებულია: ${new Date().toLocaleDateString('ka-GE')} ${new Date().toLocaleTimeString('ka-GE')}
          </div>
        </body>
      </html>
    `;
  }
}
