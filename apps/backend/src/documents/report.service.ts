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
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('ფორმა №1');

    // 0. მონაცემების ნორმალიზაცია - risks -> hazards
    let processedDocument = { ...document };
  if (document.risks && !document.hazards) {
      processedDocument.hazards = document.risks.map((risk: any) => ({
        hazardIdentification: risk.riskName || risk.hazardIdentification || '',
        photos: risk.photos || [],
        affectedPersons: risk.affectedPersons || [],
        injuryDescription: risk.injuryDescription || '',
        existingControlMeasures: risk.existingControlMeasures || '',
        initialRisk: {
          probability: risk.probability || risk.initialRisk?.probability || '',
          severity: risk.severity || risk.initialRisk?.severity || '',
          total: (risk.probability && risk.severity) ? risk.probability * risk.severity : risk.initialRisk?.total || ''
        },
        residualRisk: risk.residualRisk || { probability: '', severity: '', total: '' },
        additionalControlMeasures: risk.additionalControlMeasures || '',
        requiredMeasures: risk.requiredMeasures || '',
        responsiblePerson: risk.responsiblePerson || '',
        reviewDate: risk.reviewDate || ''
      }));
      console.log(`✅ Converted ${processedDocument.hazards.length} risks to hazards format`);
    }

    // 1. Header Data (ზედა ნაწილი) - გაუმჯობესებული ექსტრაქცია მომხმარებლის ინფორმაციით
    const evaluatorName = processedDocument.evaluatorName && processedDocument.evaluatorLastName 
      ? `${processedDocument.evaluatorName} ${processedDocument.evaluatorLastName}`.trim()
      : processedDocument.evaluatorName || processedDocument.evaluatorLastName || 
        processedDocument.evaluator || processedDocument.inspector || 
        processedDocument.createdBy || '';
    
  // მომხმარებლის დამატებითი ინფორმაცია ამოღებულია Excel-დან მოთხოვნის მიხედვით
    
    const objectName = processedDocument.objectName || 
      processedDocument.project || 
      processedDocument.facility || 
      processedDocument.location || 
      processedDocument.workSite || '';
    
    const workDescription = processedDocument.workDescription || 
      processedDocument.title || 
      processedDocument.description || 
      processedDocument.summary || '';
    
    const dateSource = processedDocument.date || processedDocument.assessmentDate || processedDocument.createdAt || processedDocument.dateCreated;
    const date = dateSource
      ? new Date(dateSource).toLocaleDateString('ka-GE')
      : new Date().toLocaleDateString('ka-GE'); // fallback to today
    // 24-hour time (HH:mm). Prefer explicit time field if available, otherwise use the date's time.
    const time = (processedDocument.time
      ? new Date(processedDocument.time)
      : (dateSource ? new Date(dateSource) : new Date())
    ).toLocaleTimeString('ka-GE', { hour12: false, hour: '2-digit', minute: '2-digit' });
    
  // დრო გამოდის თარიღის ქვეშ (იმავე უჯრაში ახალ ხაზზე)

    const headerData = [
      ['რისკის შეფასების ფორმა №1', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], // A1:P1 (16 სვეტი)
  ['შემფასებლის სახელი და გვარი:', '', evaluatorName, '', '', '', '', '', 'თარიღი:', '', `${date}\n${time}`, '', '', '', '', ''], // A2: label/value და თარიღი+დრო (ახალ ხაზზე)
      ['სამუშაო ობიექტის დასახელება:', '', objectName, '', '', '', '', '', '', '', '', '', '', '', '', ''], // A3: label/value
      ['სამუშაოს აღწერა:', '', workDescription, '', '', '', '', '', '', '', '', '', '', '', '', ''] // A4: label/value
    ];

    // 2. ცხრილის სათაურები - 15 სვეტი (თავიდან ამოღებულია "საწყისი რისკი" და "ნარჩენი რისკი" სვეტები)
  const tableHeaders = [
      [
        '№',                               // A - ნომერი
    'საფრთხის იდენტიფიკაცია',        // B (aligned with frontend form)
    'ამსახველი ფოტო/ვიდეო მასალა',               // C (requested wording)
  'პირთა წრე', // D
  'დაშავების / დაზიანების ტიპი',                 // E
    'არსებული კონტროლის ღონისძიებები', // F (requested wording)
  'საწყისი რისკის ალბათობა',               // G
  'საწყისი რისკის შედეგი',                // H
  'საწყისი რისკი',               // I
  'გასატარებელი ზომები / რეაგირება',// J
  'ნარჩენი რისკის ალბათობა',               // K
  'ნარჩენი რისკის შედეგი',                // L
  'ნარჩენი რისკი',               // M
        'საჭირო ღონისძიებები',              // N
        'შესრულებაზე პასუხისმგებელი პირი/ვადა', // O
        'გადახედვის სავარაუდო თარიღი',      // P
      ]
    ];

  // 3. ცხრილის მონაცემები (hazards) - 15 სვეტი
  const hazards = Array.isArray(processedDocument.hazards) ? processedDocument.hazards : [];
  const tableRows: any[] = [];

    if (hazards.length > 0) {
      for (const [index, hazard] of hazards.entries()) {
        const photosCount = Array.isArray(hazard.photos) ? hazard.photos.length : 0;
        const photoText = photosCount > 0 ? `იხილეთ დანართი №${index + 1}` : '';

        // ერთი row — რეალური მონაცემები (ფოტოს ველში ტექსტი)
        tableRows.push([
          (index + 1),
          hazard.hazardIdentification || '',
          photoText, // ფოტო სვეტი — ტექსტი დანართზე
          hazard.affectedPersons?.join(', ') || '',
          hazard.injuryDescription || '',
          hazard.existingControlMeasures || '',
          hazard.initialRisk?.probability ?? '',
          hazard.initialRisk?.severity ?? '',
          hazard.initialRisk?.total ?? '',
          hazard.additionalControlMeasures || '',
          hazard.residualRisk?.probability ?? '',
          hazard.residualRisk?.severity ?? '',
          hazard.residualRisk?.total ?? '',
          hazard.requiredMeasures || '',
          hazard.responsiblePerson || '',
          hazard.reviewDate ? new Date(hazard.reviewDate).toLocaleDateString('ka-GE') : ''
        ]);
      }
    } else {
      for (let i = 0; i < 5; i++) tableRows.push(new Array(tableHeaders[0].length).fill(''));
    }

    // 4. ყველა ერთად
    const fullSheetData = [
      ...headerData,
      [],
      ...tableHeaders,
      ...tableRows
    ];

    // 5. Worksheet-ში ჩასმა
    worksheet.addRows(fullSheetData);

  // 6. ფოტოების ემბედი ამოღებულია — სვეტში ჩაჯდება ტექსტი დანართზე მითითებით

  // 8. Merge-ები - სწორი ფორმატირებისთვის (16 სვეტი)
  worksheet.mergeCells('A1:P1'); // სათაური spans all 16 columns
  // A2:B2 label, C2:H2 value, I2:J2 label (თარიღი), K2:P2 value (თარიღი)
  worksheet.mergeCells('A2:B2');
  worksheet.mergeCells('C2:H2');
  worksheet.mergeCells('I2:J2');
  worksheet.mergeCells('K2:P2');
  // A3:B3 label, C3:P3 value
  worksheet.mergeCells('A3:B3');
  worksheet.mergeCells('C3:P3');
  // A4:B4 label, C4:P4 value
  worksheet.mergeCells('A4:B4');
  worksheet.mergeCells('C4:P4'); 
    
    // 9. სვეტების სიგანის მორგება - 16 სვეტი
    worksheet.columns = [
      { width: 5 },  // A - №
  { width: 25 }, // B - საფრთხის იდენტიფიკაცია
      { width: 20 }, // C - ფოტო
      { width: 25 }, // D - პოტენციურად დაზარალებული პირები
      { width: 20 }, // E - ტრავმის ხასიათი
  { width: 25 }, // F - არსებული კონტროლის ღონისძიებები
      { width: 12 }, // G - ალბათობა (საწყისი)
      { width: 12 }, // H - სიმძიმე (საწყისი)
      { width: 12 }, // I - ნამრავლი (საწყისი)
      { width: 25 }, // J - დამატებითი კონტროლის ღონისძიებები
      { width: 12 }, // K - ალბათობა (ნარჩენი)
      { width: 12 }, // L - სიმძიმე (ნარჩენი)
      { width: 12 }, // M - ნამრავლი (ნარჩენი)
      { width: 25 }, // N - საჭირო ღონისძიებები
      { width: 25 }, // O - შესრულებაზე პასუხისმგებელი პირი
      { width: 20 }, // P - გადახედვის სავარაუდო თარიღი
    ];

    // 10. სტილები - header ინფორმაცია
    const titleCell = worksheet.getCell('A1');
    titleCell.font = { size: 14, bold: true, name: 'Arial' };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    titleCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4472C4' }
    };
    titleCell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };

    // Header rows styling - გაუმჯობესებული
  for (let i = 2; i <= headerData.length + 1; i++) {
      const row = worksheet.getRow(i);
      row.eachCell((cell, colNumber) => {
  if (i === 2 && (colNumber === 1 || colNumber === 9)) { // Row 2 labels at A and I
          cell.font = { bold: true, size: 10, name: 'Arial' };
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'F2F2F2' }
          };
        } else if (i === 3 && colNumber === 1) { // Row 3 label at A
          cell.font = { bold: true, size: 10, name: 'Arial' };
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'F2F2F2' }
          };
        } else if (i === 4 && colNumber === 1) { // Row 4 label at A
          cell.font = { bold: true, size: 10, name: 'Arial' };
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'F2F2F2' }
          };
        } else {
          cell.font = { size: 10, name: 'Arial' };
        }
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
  cell.alignment = { vertical: 'middle', wrapText: true };
      });
  // Increase row height for row 2 to fit date + time on two lines
  row.height = i === 2 ? 35 : 25;
    }

    // Table Header სტილი - გაუმჯობესებული ღია ნაცრისფერი ფონით
  const headerRowIdx = headerData.length + 2;
    const headerRow = worksheet.getRow(headerRowIdx);
    headerRow.eachCell(cell => {
      cell.font = { bold: true, size: 10, name: 'Arial' };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'D3D3D3' } // ღია ნაცრისფერი
      };
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });

    // Header row height
    headerRow.height = 50;

    // ცხრილის სხეულის სტილი - გაუმჯობესებული
    const dataStartRow = headerRowIdx + 1;
    for (let i = dataStartRow; i <= dataStartRow + tableRows.length; i++) {
      const row = worksheet.getRow(i);
      row.eachCell(cell => {
        cell.font = { size: 10, name: 'Arial' };
        cell.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
      // Default row height
      if (!row.height || row.height < 40) {
        row.height = 40;
      }
    }

    // Page Setup - Landscape orientation და fit to page
    worksheet.pageSetup = {
      orientation: 'landscape',
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0, // unlimited pages vertically
      margins: {
        left: 0.7,
        right: 0.7,
        top: 0.75,
        bottom: 0.75,
        header: 0.3,
        footer: 0.3
      }
    };

    // დანართები Excel-ში - მეორე Sheet
    try {
      const attachmentSheet = workbook.addWorksheet('დანართები');
      // სათაური
      attachmentSheet.getCell('A1').value = 'ფოტო დანართები';
      attachmentSheet.getCell('A1').font = { size: 16, bold: true, name: 'Arial' } as any;
      attachmentSheet.mergeCells('A1:D1');

      let currentRow = 3;

      // დოკუმენტის ფოტოები
      if (processedDocument.photos && Array.isArray(processedDocument.photos) && processedDocument.photos.length > 0) {
        attachmentSheet.getCell(`A${currentRow}`).value = 'დოკუმენტის ფოტოები:';
        attachmentSheet.getCell(`A${currentRow}`).font = { bold: true, name: 'Arial' } as any;
        currentRow += 1;

        processedDocument.photos.forEach((photo: string, index: number) => {
          if (typeof photo === 'string' && photo.startsWith('data:image/')) {
            try {
              const base64Data = photo.split(',')[1];
              // ExcelJS supports only 'png' and 'jpeg' extensions
              const lower = photo.toLowerCase();
              const extension = lower.includes('png') ? 'png' : 'jpeg';
              const imageId = workbook.addImage({ base64: base64Data, extension } as any);

              // სურათის ჩასმა
              attachmentSheet.addImage(imageId, { tl: { col: 1, row: currentRow - 1 }, ext: { width: 300, height: 200 } } as any);
              attachmentSheet.getCell(`A${currentRow}`).value = `დოკუმენტის ფოტო ${index + 1}`;
              // რიგის სიმაღლე (დაახლ. 15 პოინტი = 20px)
              for (let r = 0; r < 14; r++) {
                const row = attachmentSheet.getRow(currentRow + r);
                if (!row.height || row.height < 18) row.height = 18;
              }
              currentRow += 14; // ადგილი შემდეგისთვის
            } catch (err) {
              // ignore single photo failure
            }
          }
        });
      }

      // საფრთხეების ფოტოები
      const hazardsForAttachments = Array.isArray(processedDocument.hazards) ? processedDocument.hazards : [];
      hazardsForAttachments.forEach((hazard: any, hazardIndex: number) => {
        if (hazard && Array.isArray(hazard.photos) && hazard.photos.length > 0) {
          attachmentSheet.getCell(`A${currentRow}`).value = `დანართი №${hazardIndex + 1} - ${hazard.hazardIdentification || 'საფრთხე'}`;
          attachmentSheet.getCell(`A${currentRow}`).font = { bold: true, name: 'Arial' } as any;
          currentRow += 1;

          hazard.photos.forEach((photo: string, photoIndex: number) => {
            if (typeof photo === 'string' && photo.startsWith('data:image/')) {
              try {
                const base64Data = photo.split(',')[1];
                // ExcelJS supports only 'png' and 'jpeg' extensions
                const lower = photo.toLowerCase();
                const extension = lower.includes('png') ? 'png' : 'jpeg';
                const imageId = workbook.addImage({ base64: base64Data, extension } as any);

                attachmentSheet.addImage(imageId, { tl: { col: 1, row: currentRow - 1 }, ext: { width: 300, height: 200 } } as any);
                attachmentSheet.getCell(`A${currentRow}`).value = `ფოტო ${photoIndex + 1}`;
                for (let r = 0; r < 14; r++) {
                  const row = attachmentSheet.getRow(currentRow + r);
                  if (!row.height || row.height < 18) row.height = 18;
                }
                currentRow += 14;
              } catch (err) {
                // ignore single photo failure
              }
            }
          });

          currentRow += 2; // spacer შემდეგი საფრთხისთვის
        }
      });

      // სვეტების სიგანე
      attachmentSheet.columns = [
        { width: 15 },
        { width: 40 },
        { width: 40 },
        { width: 40 }
      ] as any;
    } catch (e) {
      // არა-კრიტიკული; დანართების ფურცელი ვერ გენერირდა
      console.warn('⚠️ Excel attachment sheet generation failed:', e?.message);
    }

    // 11. ფაილის გენერაცია
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
        timeout: 60000,
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
          '--disable-font-subpixel-positioning',
          '--lang=ka-GE',
          '--accept-lang=ka-GE,ka,en-US,en'
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
          '/opt/render/project/src/.chrome/chrome',
          '/app/.apt/usr/bin/google-chrome-stable'
        ].filter(Boolean);
        
        console.log('🔍 Checking possible Chrome paths:', possiblePaths);
        
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
        
        // Set locale and encoding
        await page.setExtraHTTPHeaders({
          'Accept-Language': 'ka-GE,ka,en-US,en'
        });
        
        // Set viewport for consistent rendering
        await page.setViewport({ width: 1200, height: 800 });
        
        // ქართული ფონტების მხარდაჭერისთვის - system fonts with DejaVu Sans
        await page.evaluateOnNewDocument(() => {
          // Force UTF-8 encoding
          const meta = document.createElement('meta');
          meta.setAttribute('charset', 'UTF-8');
          document.head.appendChild(meta);
          
          // Add comprehensive font rule
          const style = document.createElement('style');
          style.textContent = `
            @font-face {
              font-family: 'GeorgianPDF';
              src: local('DejaVu Sans'),
                   local('Liberation Sans'),
                   local('Noto Sans'),
                   local('Ubuntu'),
                   local('Arial'),
                   local('sans-serif');
              unicode-range: U+10A0-10FF, U+0000-00FF;
            }
            * {
              font-family: 'GeorgianPDF', 'DejaVu Sans', 'Liberation Sans', 'Noto Sans', Arial, sans-serif !important;
            }
          `;
          document.head.appendChild(style);
        });
        
        console.log('📝 Setting page content...');
        
        // Use regular HTML with enhanced font loading
        await page.setContent(html, { 
          waitUntil: 'networkidle0',
          timeout: 30000 
        });

        // Wait for fonts to load - simple timeout
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        console.log('⏳ Testing Georgian font rendering...');
        
        // Test Georgian text rendering
        await page.evaluate(() => {
          // Create a test element to verify Georgian font loading
          const testDiv = document.createElement('div');
          testDiv.textContent = 'ქართული ტექსტი - აბგდევზთიკლმნოპჟრსტუფქღყშჩცძწჭხჯჰ';
          testDiv.style.fontFamily = 'GeorgianPDF, DejaVu Sans, Arial';
          testDiv.style.position = 'absolute';
          testDiv.style.top = '-9999px';
          testDiv.style.fontSize = '12px';
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
            landscape: true,
            printBackground: true,
            margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' },
            displayHeaderFooter: false,
            timeout: 60000
          });
        } catch (pdfError) {
          console.log('⚠️ First PDF attempt failed, trying fallback options...');
          
          // Fallback with minimal options
          pdfBuffer = await page.pdf({
            format: 'A4',
            landscape: true,
            printBackground: false,
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
    const time = document.time
      ? new Date(document.time).toLocaleTimeString('ka-GE', { hour12: false, hour: '2-digit', minute: '2-digit' })
      : '';

    // საფრთხეების ცხრილი - 17 სვეტი (Excel-ის მსგავსი)
    const hazards = Array.isArray(document.hazards) ? document.hazards : [];
  const hazardsHTML = hazards.length > 0
      ? hazards.map((hazard: any, index: number) => {
          // ფოტოების რაოდენობის ჩვენება binary მონაცემების ნაცვლად
          const photosCount = hazard.photos && Array.isArray(hazard.photos) ? hazard.photos.length : 0;
            const photosText = photosCount > 0 ? `იხილეთ დანართი №${index + 1}` : '';
          
          return `
          <tr>
            <td class="num-cell">${index + 1}</td>
            <td>${hazard.hazardIdentification || ''}</td>
            <td>${photosText}</td>
            <td>${hazard.affectedPersons?.join(', ') || ''}</td>
            <td>${hazard.injuryDescription || ''}</td>
            <td>${hazard.existingControlMeasures || ''}</td>
            <td class="num-cell">${hazard.initialRisk?.probability || ''}</td>
            <td class="num-cell">${hazard.initialRisk?.severity || ''}</td>
            <td class="num-cell">${hazard.initialRisk?.total || ''}</td>
            <td>${hazard.additionalControlMeasures || ''}</td>
            <td class="num-cell">${hazard.residualRisk?.probability || ''}</td>
            <td class="num-cell">${hazard.residualRisk?.severity || ''}</td>
            <td class="num-cell">${hazard.residualRisk?.total || ''}</td>
            <td>${hazard.requiredMeasures || ''}</td>
            <td>${hazard.responsiblePerson || ''}</td>
            <td>${hazard.reviewDate ? new Date(hazard.reviewDate).toLocaleDateString('ka-GE') : ''}</td>
          </tr>
        `;
        }).join('')
      : '<tr><td colspan="18">საფრთხეები არ იქნა იდენტიფიცირებული</td></tr>';

    // დანართების HTML სექცია (ბოლო გვერდები)
    let attachmentsHTML = `
      <div style="page-break-before: always;"></div>
      <div style="padding: 20px;">
        <h2 style="text-align: center; color: #333;">ფოტო დანართები</h2>
    `;

    const docPhotos = Array.isArray(document.photos) ? document.photos : [];
    if (docPhotos.length > 0) {
      attachmentsHTML += `<h3>დოკუმენტის ფოტოები:</h3>`;
      attachmentsHTML += `<div style="display: flex; flex-wrap: wrap; gap: 20px;">`;
      docPhotos.forEach((photo: string, index: number) => {
        if (typeof photo === 'string' && photo.startsWith('data:image/')) {
          attachmentsHTML += `
            <div style="margin-bottom: 20px; page-break-inside: avoid;">
              <p style="font-weight: bold;">დოკუმენტის ფოტო ${index + 1}</p>
              <img src="${photo}" style="max-width: 300px; max-height: 400px; border: 1px solid #ddd; padding: 5px;" />
            </div>
          `;
        }
      });
      attachmentsHTML += `</div>`;
    }

    let hasHazardPhotos = false;
    hazards.forEach((hazard: any, hazardIndex: number) => {
      if (hazard.photos && Array.isArray(hazard.photos) && hazard.photos.length > 0) {
        hasHazardPhotos = true;
        attachmentsHTML += `
          <div style="page-break-inside: avoid; margin-top: 30px;">
            <h3>დანართი №${hazardIndex + 1} - ${hazard.hazardIdentification || 'საფრთხე'}</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 20px;">
        `;
        hazard.photos.forEach((photo: string, photoIndex: number) => {
          if (typeof photo === 'string' && photo.startsWith('data:image/')) {
            attachmentsHTML += `
              <div style="margin-bottom: 20px; page-break-inside: avoid;">
                <p style="font-weight: bold;">ფოტო ${photoIndex + 1}</p>
                <img src="${photo}" style="max-width: 300px; max-height: 400px; border: 1px solid #ddd; padding: 5px;" />
              </div>
            `;
          }
        });
        attachmentsHTML += `</div></div>`;
      }
    });

    if (docPhotos.length === 0 && !hasHazardPhotos) {
      attachmentsHTML += `<p style="text-align: center; color: #666; margin-top: 50px;">ფოტო დანართები არ არის</p>`;
    }

    attachmentsHTML += `</div>`;

    return `
      <!DOCTYPE html>
      <html lang="ka">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>რისკის შეფასების ფორმა №1</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Georgian:wght@100..900&display=swap" rel="stylesheet">
          <style>
            /* Use only reliable system fonts that support Georgian */
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
              font-family: 'DejaVu Sans', 'Liberation Sans', 'Arial Unicode MS', 'Arial', 'Helvetica', sans-serif !important;
            }
            
            body { 
              font-family: 'DejaVu Sans', 'Liberation Sans', 'Arial Unicode MS', 'Arial', 'Helvetica', sans-serif !important; 
              font-size: 10px; 
              line-height: 1.2;
              color: #000;
              background: white;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
            }
            
            .header { 
              text-align: center; 
              background: #4472C4; 
              color: white; 
              padding: 12px; 
              margin-bottom: 20px; 
              font-size: 14px;
              font-weight: bold;
              font-family: 'DejaVu Sans', 'Liberation Sans', 'Arial', sans-serif !important;
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
            .hazards-table td.num-cell {
              padding: 0 2px !important;
              text-align: center !important;
              border: 1px solid #333 !important;
              background: #fff !important;
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
              size: A4 landscape;
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
                <td>შემფასებლის სახელი და გვარი:</td>
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
          </div>
          
          <div class="hazards-section">
            <table class="hazards-table">
              <thead>
                <tr>
                  <th>№</th>
                  <th>საფრთხის იდენტიფიკაცია</th>
                  <th>ამსახველი ფოტო/ვიდეო მასალა</th>
                  <th>პირთა წრე</th>
                  <th>დაშავების / დაზიანების ტიპი</th>
                  <th>არსებული კონტროლის ზომები</th>
                  <th>საწყისი რისკის ალბათობა</th>
                  <th>საწყისი რისკის შედეგი</th>
                  <th>საწყისი რისკი</th>
                  <th>გასატარებელი ზომები / რეაგირება</th>
                  <th>ნარჩენი რისკის ალბათობა</th>
                  <th>ნარჩენი რისკის შედეგი</th>
                  <th>ნარჩენი რისკი</th>
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
            გენერირებულია: ${new Date().toLocaleDateString('ka-GE')} ${new Date().toLocaleTimeString('ka-GE', { hour12: false, hour: '2-digit', minute: '2-digit' })}
          </div>
          ${attachmentsHTML}
        </body>
      </html>
    `;
  }

}
