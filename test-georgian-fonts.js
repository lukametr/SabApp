const fs = require('fs');

// Test document
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
      initialRisk: { probability: 3, severity: 4, total: 12 },
      residualRisk: { probability: 2, severity: 3, total: 6 },
      requiredMeasures: 'საჭირო ღონისძიება',
      responsiblePerson: 'ლუკა მეტრეველი',
    },
  ],
};

// Simple HTML with Times New Roman (should support Georgian)
function generateHTML(document) {
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
    <html lang="ka">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>რისკის შეფასების ფორმა</title>
        <style>
          * {
            font-family: 'Times New Roman', serif !important;
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body { 
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
        
        <!-- Georgian test text -->
        <p>ტესტ ტექსტი: აბგდევზთიკლმნოპჟრსტუფქღყშჩცძწჭხჯჰ</p>
        
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

console.log('📄 Creating Times New Roman test HTML...');
const html = generateHTML(testDocument);
fs.writeFileSync('test-georgian-fonts.html', html);
console.log('✅ HTML ფაილი შეიქმნა: test-georgian-fonts.html');
console.log('🔤 გახსენი ბრაუზერში და ნახე ჩანს თუ არა ქართული ტექსტი');
console.log('📝 თუ Times New Roman-ში ჩანს, მაშინ PDF-შიც უნდა ჩანდეს');
