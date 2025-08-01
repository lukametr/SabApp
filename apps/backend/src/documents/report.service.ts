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
      console.log('🔄 Converting risks to hazards format for Excel generation');
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

    // 1. Header Data (ზედა ნაწილი)
    const evaluatorName = `${processedDocument.evaluatorName || ''} ${processedDocument.evaluatorLastName || ''}`.trim();
    const objectName = processedDocument.objectName || processedDocument.project || '';
    const workDescription = processedDocument.workDescription || processedDocument.title || '';
    const date = processedDocument.date || processedDocument.assessmentDate ? 
      new Date(processedDocument.date || processedDocument.assessmentDate).toLocaleDateString('ka-GE') : '';
    const time = processedDocument.time ? new Date(processedDocument.time).toLocaleTimeString('ka-GE') : '';

    const headerData = [
      ['რისკის შეფასების ფორმა №1', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], // A1:Q1
      ['შეფასებლის სახელი და გვარი:', evaluatorName, '', '', '', '', '', '', '', 'თარიღი:', date, '', '', '', '', '', ''], // A2:I2 და J2:Q2 
      ['სამუშაო ობიექტის დასახელება:', objectName, '', '', '', '', '', '', '', 'დრო:', time, '', '', '', '', '', ''], // A3:I3 და J3:Q3
      ['სამუშაოს დაწყების თარიღი:', workDescription, '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''] // A4:Q4
    ];

    // 2. ცხრილის სათაურები - 17 სვეტი
    const tableHeaders = [
      [
        'საფრთხე და იდენტიფიკაცია',
        'ფოტო/ვიდეო მასალა',
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
    const hazards = Array.isArray(processedDocument.hazards) ? processedDocument.hazards : [];
    const tableRows = hazards.length > 0
      ? hazards.map((hazard: any) => {
          return [
            hazard.hazardIdentification || '',  
            '', // ფოტო სვეტი ცარიელი - ფოტო შემდეგ ჩაისვება
            hazard.affectedPersons?.join(', ') || '',  
            hazard.injuryDescription || '',     
            hazard.existingControlMeasures || '',  
            hazard.initialRisk?.total || '',    
            hazard.initialRisk?.probability || '',    
            hazard.initialRisk?.severity || '',       
            hazard.initialRisk?.total || '',          
            hazard.additionalControlMeasures || '',  
            hazard.residualRisk?.total || '',   
            hazard.residualRisk?.probability || '',   
            hazard.residualRisk?.severity || '',      
            hazard.residualRisk?.total || '',         
            hazard.requiredMeasures || '',      
            hazard.responsiblePerson || '',     
            hazard.reviewDate ? new Date(hazard.reviewDate).toLocaleDateString('ka-GE') : ''  
          ];
        })
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

    // Helper ფუნქცია Excel სვეტების letter-ებისთვის (A, B, C... Z, AA, AB...)
    const getColumnLetter = (col: number): string => {
      let letter = '';
      while (col >= 0) {
        letter = String.fromCharCode(65 + (col % 26)) + letter;
        col = Math.floor(col / 26) - 1;
      }
      return letter;
    };

    // 6. ფოტოების ჩასმის ფუნქცია - გაუმჯობესებული ზომებით
    const addImageToWorksheet = async (base64Data: string, position: { col: number, row: number, width?: number, height?: number }) => {
      try {
        // base64 სტრინგიდან ბაფერის შექმნა
        const matches = base64Data.match(/^data:([^;]+);base64,(.+)$/);
        if (matches) {
          const mimeType = matches[1];
          const base64Content = matches[2];
          const buffer = Buffer.from(base64Content, 'base64');
          
          // Extension ტიპის განსაზღვრა
          let extension: 'png' | 'jpeg' | 'gif' = 'png';
          if (mimeType.includes('jpeg') || mimeType.includes('jpg')) {
            extension = 'jpeg';
          } else if (mimeType.includes('png')) {
            extension = 'png';
          } else if (mimeType.includes('gif')) {
            extension = 'gif';
          }

          // ფოტოს ჩამატება workbook-ში
          const imageId = workbook.addImage({
            buffer: buffer,
            extension: extension,
          });

          // ზუსტი range გამოთვლა position პარამეტრების გამოყენებით - column overflow დაცვით
          const startRow = position.row; // 1-based Excel row
          const startCol = getColumnLetter(position.col); // უსაფრთხო column letter გენერაცია
          const endCol = getColumnLetter(position.col + (position.width || 1));
          const endRow = startRow + (position.height || 2);
          const range = `${startCol}${startRow}:${endCol}${endRow}`;
          
          // ფოტოს ჩამატება დინამიურად გამოთვლილი ზომით
          worksheet.addImage(imageId, range);

          console.log(`✅ Added image at range: ${range} with dynamic size`);
        } else {
          console.error('❌ Invalid base64 image format');
        }
      } catch (error) {
        console.error('❌ Error adding image to Excel:', error);
      }
    };

    // 7. ფოტოების ჩასმა hazards-ისთვის - გაუმჯობესებული
    if (hazards.length > 0) {
      const headerRowsCount = headerData.length + 1; // header rows + empty row
      const tableHeaderRow = headerRowsCount + 1; // table header row
      const dataStartRow = tableHeaderRow + 1; // მონაცემების დაწყების სტრიქონი (სწორი)
      
      for (let i = 0; i < hazards.length; i++) {
        const hazard = hazards[i];
        const currentExcelRow = dataStartRow + i; // Excel row number (1-based)
        
        if (hazard.photos && hazard.photos.length > 0) {
          console.log(`📸 Adding ${hazard.photos.length} photos for hazard ${i + 1}`);
          
          // მრავალი ფოტოს სწორი პოზიციონირება
          const photosPerRow = 2; // 2 ფოტო ჰორიზონტალურად
          const photoRows = Math.ceil(hazard.photos.length / photosPerRow);
          
          // დინამიური spacing ფოტოების ზომის მიხედვით
          const baseSpacing = 3; // ძირითადი spacing
          const photoHeight = 3; // ფოტოს სიმაღლე
          const spacingMultiplier = Math.max(baseSpacing, photoHeight + 1); // მინიმუმ 4 სტრიქონი spacing
          
          // სტრიქონის სიმაღლის გაზრდა ფოტოებისთვის - დინამიური სიმაღლე
          worksheet.getRow(currentExcelRow).height = photoRows * 60;
          
          // ყველა ფოტოს ჩამატება სწორი პოზიციონირებით
          for (let photoIndex = 0; photoIndex < hazard.photos.length; photoIndex++) {
            const photo = hazard.photos[photoIndex];
            const col = 1 + (photoIndex % photosPerRow); // B ან C სვეტი
            const photoRow = currentExcelRow + Math.floor(photoIndex / photosPerRow) * spacingMultiplier; // დინამიური spacing
            
            // Column boundary შემოწმება - ფოტო არ უნდა გადავიდეს ცხრილის ზღვარს
            const maxCol = 16; // Q სვეტი არის 16 (0-indexed)
            const safeCol = Math.min(col, maxCol - 2); // 2 სვეტი დავტოვოთ width-ისთვის
            
            await addImageToWorksheet(photo, { 
              col: safeCol, // უსაფრთხო სვეტი
              row: photoRow, // განსხვავებული row ყოველი ფოტოსთვის
              width: 1.5, // უფრო ფართო
              height: photoHeight   // დინამიური სიმაღლე
            });
          }
        }
      }
    }

    // 8. Merge-ები - სწორი ფორმატირებისთვის
    worksheet.mergeCells('A1:Q1'); // სათაური spans all 17 columns
    worksheet.mergeCells('A2:I2'); // შეფასებლის სახელი და გვარი
    worksheet.mergeCells('J2:Q2'); // თარიღი
    worksheet.mergeCells('A3:I3'); // სამუშაო ობიექტის დასახელება
    worksheet.mergeCells('J3:Q3'); // დრო
    worksheet.mergeCells('A4:Q4'); // სამუშაოს დაწყების თარიღი spans all columns 
    
    // 9. სვეტების სიგანის მორგება - 17 სვეტი
    worksheet.columns = [
      { width: 25 }, // A - საფრთხე და იდენტიფიკაცია
      { width: 20 }, // B - ფოტო (გაფართოვებული ფოტოებისთვის)
      { width: 25 }, // C - პოტენციურად დაზარალებული პირები
      { width: 20 }, // D - ტრავმის ხასიათი
      { width: 25 }, // E - მიმდინარე კონტროლის ღონისძიებები
      { width: 15 }, // F - საწყისი რისკი
      { width: 12 }, // G - ალბათობა
      { width: 12 }, // H - სიმძიმე
      { width: 12 }, // I - ნამრავლი
      { width: 25 }, // J - დამატებითი კონტროლის ღონისძიებები
      { width: 15 }, // K - ნარჩენი რისკი
      { width: 12 }, // L - ალბათობა
      { width: 12 }, // M - სიმძიმე
      { width: 12 }, // N - ნამრავლი
      { width: 25 }, // O - საჭირო ღონისძიებები
      { width: 25 }, // P - შესრულებაზე პასუხისმგებელი პირი
      { width: 20 }, // Q - გადახედვის სავარაუდო თარიღი
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
        if (colNumber === 1 || colNumber === 10) { // Label columns
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
      row.height = 25;
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
            landscape: false,
            printBackground: true,
            width: '297mm',
            height: '210mm',
            margin: {
              top: '5mm',
              right: '5mm', 
              bottom: '5mm',
              left: '5mm'
            },
            displayHeaderFooter: false,
            timeout: 60000,
            scale: 0.8
          });
        } catch (pdfError) {
          console.log('⚠️ First PDF attempt failed, trying fallback options...');
          
          // Fallback with minimal options
          pdfBuffer = await page.pdf({
            format: 'A4',
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
    const time = document.time ? new Date(document.time).toLocaleTimeString('ka-GE') : '';

    // საფრთხეების ცხრილი - 17 სვეტი (Excel-ის მსგავსი)
    const hazards = Array.isArray(document.hazards) ? document.hazards : [];
    const hazardsHTML = hazards.length > 0
      ? hazards.map((hazard: any, index: number) => {
          // ფოტოების რაოდენობის ჩვენება binary მონაცემების ნაცვლად
          const photosCount = hazard.photos && Array.isArray(hazard.photos) ? hazard.photos.length : 0;
          const photosText = photosCount > 0 ? `${photosCount} ფოტო` : 'ფოტო არ არის';
          
          return `
          <tr>
            <td>${index + 1}</td>
            <td>${hazard.hazardIdentification || ''}</td>
            <td>${photosText}</td>
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
        `;
        }).join('')
      : '<tr><td colspan="18">საფრთხეები არ იქნა იდენტიფიცირებული</td></tr>';

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

}
