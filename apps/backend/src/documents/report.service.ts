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
  }

  /**
   * დოკუმენტის PDF ფაილის შექმნა
   */
  async generatePDFReport(document: any): Promise<Buffer> {
    try {
      const html = this.generateHTMLReport(document);
      
      // Production-ისთვის Chrome executable path და arguments
      const isProduction = process.env.NODE_ENV === 'production';
      const browserOptions: any = { 
        headless: true,
        args: [
          '--no-sandbox', 
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process', // For Railway/Render
          '--disable-gpu'
        ]
      };

      // Production-ში executablePath-ის მითითება
      if (isProduction) {
        // Production-ზე Google Chrome-ის პოვნა
        const possiblePaths = [
          process.env.PUPPETEER_EXECUTABLE_PATH,
          process.env.CHROME_BIN,
          '/usr/bin/google-chrome-stable',
          '/usr/bin/google-chrome',
          '/usr/bin/chromium-browser',
          '/usr/bin/chromium'
        ].filter(Boolean);
        
        console.log('🔍 Checking possible Chrome paths:', possiblePaths);
        
        // რეალური ფაილის არსებობის შემოწმება
        let chromiumPath = possiblePaths[0] || '/usr/bin/google-chrome-stable';
        for (const path of possiblePaths) {
          if (path && existsSync(path)) {
            chromiumPath = path;
            console.log('✅ Found Chrome at:', path);
            break;
          }
        }
        
        browserOptions.executablePath = chromiumPath;
        console.log('🔧 Using Chrome path:', chromiumPath);
      }
      
      console.log('🚀 Launching Puppeteer with options:', JSON.stringify(browserOptions, null, 2));
      const browser = await puppeteer.launch(browserOptions);
      
      try {
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });
        
        const pdfBuffer = await page.pdf({
          format: 'A4',
          printBackground: true,
          margin: {
            top: '20px',
            right: '20px',
            bottom: '20px',
            left: '20px'
          }
        });
        
        console.log('✅ PDF generated successfully, size:', pdfBuffer.length, 'bytes');
        return Buffer.from(pdfBuffer);
      } finally {
        await browser.close();
      }
    } catch (error) {
      console.error('❌ PDF Generation Error:', error);
      console.error('🔍 Environment details:', {
        NODE_ENV: process.env.NODE_ENV,
        PUPPETEER_EXECUTABLE_PATH: process.env.PUPPETEER_EXECUTABLE_PATH,
        platform: process.platform
      });
      throw new Error(`PDF გენერაცია ვერ მოხერხდა: ${error.message}`);
    }
  }

  /**
   * HTML რეპორტის შექმნა
   */
  private generateHTMLReport(document: any): string {
    const hazardsHTML = document.hazards?.map((hazard: any, index: number) => `
      <tr>
        <td>${index + 1}</td>
        <td>${hazard.hazard || 'N/A'}</td>
        <td>${hazard.probability || 'N/A'}</td>
        <td>${hazard.severity || 'N/A'}</td>
        <td>${hazard.initialRisk || 'N/A'}</td>
        <td>${hazard.residualRisk || 'N/A'}</td>
        <td>${hazard.preventiveMeasure || 'N/A'}</td>
      </tr>
    `).join('') || '<tr><td colspan="7">საფრთხეები არ იქნა იდენტიფიცირებული</td></tr>';

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>უსაფრთხოების შეფასება</title>
          <style>
            body { font-family: 'Arial', sans-serif; margin: 20px; }
            .header { text-align: center; background: #4472C4; color: white; padding: 20px; margin-bottom: 30px; }
            .info-section { margin-bottom: 30px; }
            .info-table { width: 100%; border-collapse: collapse; }
            .info-table td { padding: 8px; border: 1px solid #ddd; }
            .info-table td:first-child { background: #f5f5f5; font-weight: bold; width: 30%; }
            .hazards-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            .hazards-table th, .hazards-table td { padding: 8px; border: 1px solid #ddd; text-align: left; }
            .hazards-table th { background: #E7E6E6; font-weight: bold; }
            .section-title { font-size: 18px; font-weight: bold; margin: 20px 0 10px 0; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>უსაფრთხოების შეფასების დოკუმენტი</h1>
          </div>
          
          <div class="info-section">
            <h2 class="section-title">ძირითადი ინფორმაცია</h2>
            <table class="info-table">
              <tr><td>შემფასებლის სახელი:</td><td>${document.evaluatorName} ${document.evaluatorLastName}</td></tr>
              <tr><td>ობიექტის დასახელება:</td><td>${document.objectName}</td></tr>
              <tr><td>სამუშაოს აღწერა:</td><td>${document.workDescription}</td></tr>
              <tr><td>თარიღი:</td><td>${new Date(document.date).toLocaleDateString('ka-GE')}</td></tr>
              <tr><td>დრო:</td><td>${new Date(document.time).toLocaleTimeString('ka-GE')}</td></tr>
              <tr><td>საფრთხეების რაოდენობა:</td><td>${document.hazards?.length || 0}</td></tr>
              <tr><td>ფოტოების რაოდენობა:</td><td>${(document.photos?.length || 0) + (document.hazards?.reduce((sum: number, h: any) => sum + (h.photos?.length || 0), 0) || 0)}</td></tr>
            </table>
          </div>
          
          <div class="hazards-section">
            <h2 class="section-title">იდენტიფიცირებული საფრთხეები</h2>
            <table class="hazards-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>საფრთხე</th>
                  <th>ალბათობა</th>
                  <th>მნიშვნელობა</th>
                  <th>რისკი (საწყისი)</th>
                  <th>რისკი (ნარჩენი)</th>
                  <th>ღონისძიება</th>
                </tr>
              </thead>
              <tbody>
                ${hazardsHTML}
              </tbody>
            </table>
          </div>
          
          <div style="margin-top: 50px; text-align: center; font-size: 12px; color: #666;">
            გენერირებულია: ${new Date().toLocaleDateString('ka-GE')} ${new Date().toLocaleTimeString('ka-GE')}
          </div>
        </body>
      </html>
    `;
  }
}
