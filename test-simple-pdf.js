const fs = require('fs');

// Test document data - მარტივი ვერსია PDF ტესტისთვის
const testDocument = {
  evaluatorName: 'ლუკა',
  evaluatorLastName: 'მეტრეველი',
  objectName: 'ოფისი №1',
  workDescription: 'კომპიუტერებთან მუშაობა',
  date: new Date(),
  time: new Date(),
  hazards: [
    {
      hazardIdentification: 'ელექტრო მომენტი',
      initialRisk: {
        probability: 3,
        severity: 4,
        total: 12,
      },
      residualRisk: {
        probability: 2,
        severity: 3,
        total: 6,
      },
      requiredMeasures: 'საჭირო ღონისძიება',
      responsiblePerson: 'ლუკა მეტრეველი',
    },
  ],
};

// Simplified HTML generator (PDF-ისთვის)
function generateSimplifiedHTML(document) {
  const evaluatorName =
    `${document.evaluatorName || ''} ${document.evaluatorLastName || ''}`.trim();
  const objectName = document.objectName || '';
  const workDescription = document.workDescription || '';
  const date = document.date ? new Date(document.date).toLocaleDateString('ka-GE') : '';
  const time = document.time ? new Date(document.time).toLocaleTimeString('ka-GE') : '';

  const hazards = Array.isArray(document.hazards) ? document.hazards : [];
  const hazardsHTML =
    hazards.length > 0
      ? hazards
          .map(
            (hazard, index) => `
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
      `
          )
          .join('')
      : '<tr><td colspan="10">საფრთხეები არ იქნა იდენტიფიცირებული</td></tr>';

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>რისკის შეფასების ფორმა</title>
        <style>
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

async function testHTML() {
  try {
    console.log('📄 იწყება HTML ტესტი (Simplified for PDF)...');

    const html = generateSimplifiedHTML(testDocument);

    // ფაილის შენახვა
    fs.writeFileSync('test-simplified-pdf.html', html);

    console.log('✅ Simplified HTML წარმატებით შეიქმნა!');
    console.log('📁 ფაილი შენახულია: test-simplified-pdf.html');
    console.log('🌐 გახსენი ბრაუზერში და დაბეჭდე PDF-ში');
    console.log('📊 ეს HTML უფრო compatible-ია PDF generation-ისთვის');
  } catch (error) {
    console.error('❌ HTML შექმნისას მოხდა შეცდომა:', error.message);
  }
}

testHTML();
