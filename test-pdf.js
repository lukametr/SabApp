const fs = require('fs');

// ტესტ დოკუმენტი (ზუსტად ისეთივე როგორც ბაზაში)
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
      photos: ['photo1.jpg', 'photo2.jpg'],
      affectedPersons: ['თანამშრომელი 1', 'თანამშრომელი 2'],
      injuryDescription: 'ელექტრო დარტყმა',
      existingControlMeasures: 'ვარიანტი 1',
      initialRisk: {
        probability: 3,
        severity: 4,
        total: 12,
      },
      additionalControlMeasures: 'დამატებითი ვარიანტი',
      residualRisk: {
        probability: 2,
        severity: 3,
        total: 6,
      },
      requiredMeasures: 'საჭირო ვარიანტი',
      responsiblePerson: 'ლუკა მეტრეველი',
      reviewDate: new Date(),
    },
    {
      hazardIdentification: 'სამუშაო სივრცის არეული განლაგება',
      photos: [],
      affectedPersons: ['ყველა თანამშრომელი'],
      injuryDescription: 'დაეცემა, ტრავმა',
      existingControlMeasures: 'არც ერთი',
      initialRisk: {
        probability: 4,
        severity: 3,
        total: 12,
      },
      additionalControlMeasures: 'მოწესრიგება',
      residualRisk: {
        probability: 2,
        severity: 2,
        total: 4,
      },
      requiredMeasures: 'სივრცის დალაგება',
      responsiblePerson: 'ადმინისტრაცია',
      reviewDate: new Date(),
    },
  ],
};

// HTML generator function (PDF-ის HTML ნაწილი)
function generateHTMLReport(document) {
  // ძირითადი ინფორმაცია
  const evaluatorName =
    `${document.evaluatorName || ''} ${document.evaluatorLastName || ''}`.trim();
  const objectName = document.objectName || '';
  const workDescription = document.workDescription || '';
  const date = document.date ? new Date(document.date).toLocaleDateString('ka-GE') : '';
  const time = document.time ? new Date(document.time).toLocaleTimeString('ka-GE') : '';

  // საფრთხეების ცხრილი - 17 სვეტი (Excel-ის მსგავსი)
  const hazards = Array.isArray(document.hazards) ? document.hazards : [];
  const hazardsHTML =
    hazards.length > 0
      ? hazards
          .map(
            (hazard, index) => `
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
      `
          )
          .join('')
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
            font-family: 'Noto Sans Georgian', 'BPG Arial', 'DejaVu Sans', Arial, sans-serif; 
            margin: 15px; 
            font-size: 10px; 
            line-height: 1.2;
          }
          
          .header { 
            text-align: center; 
            background: #4472C4; 
            color: white; 
            padding: 15px; 
            margin-bottom: 20px; 
            font-size: 14px;
            font-weight: bold;
          }
          
          .info-section { 
            margin-bottom: 20px; 
          }
          
          .info-table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-bottom: 15px;
          }
          
          .info-table td { 
            padding: 5px; 
            border: 1px solid #ddd; 
            font-size: 9px;
          }
          
          .info-table td:first-child { 
            background: #f5f5f5; 
            font-weight: bold; 
            width: 25%; 
          }
          
          .hazards-table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 15px; 
            font-size: 8px;
            table-layout: fixed;
          }
          
          .hazards-table th, .hazards-table td { 
            padding: 4px; 
            border: 1px solid #333; 
            text-align: center; 
            vertical-align: middle;
            word-wrap: break-word;
            overflow-wrap: break-word;
          }
          
          .hazards-table th { 
            background: #E7E6E6; 
            font-weight: bold; 
            font-size: 7px;
            line-height: 1.1;
          }
          
          .hazards-table td { 
            text-align: left; 
          }
          
          /* სვეტების სიგანე */
          .hazards-table th:nth-child(1), .hazards-table td:nth-child(1) { width: 3%; } /* № */
          .hazards-table th:nth-child(2), .hazards-table td:nth-child(2) { width: 10%; } /* საფრთხე */
          .hazards-table th:nth-child(3), .hazards-table td:nth-child(3) { width: 8%; } /* ფოტო */
          .hazards-table th:nth-child(4), .hazards-table td:nth-child(4) { width: 8%; } /* პირები */
          .hazards-table th:nth-child(5), .hazards-table td:nth-child(5) { width: 8%; } /* ტრავმა */
          .hazards-table th:nth-child(6), .hazards-table td:nth-child(6) { width: 10%; } /* მიმდინარე */
          .hazards-table th:nth-child(7), .hazards-table td:nth-child(7) { width: 6%; } /* საწყისი რისკი */
          .hazards-table th:nth-child(8), .hazards-table td:nth-child(8) { width: 5%; } /* ალბათობა */
          .hazards-table th:nth-child(9), .hazards-table td:nth-child(9) { width: 5%; } /* სიმძიმე */
          .hazards-table th:nth-child(10), .hazards-table td:nth-child(10) { width: 5%; } /* ნამრავლი */
          .hazards-table th:nth-child(11), .hazards-table td:nth-child(11) { width: 10%; } /* დამატებითი */
          .hazards-table th:nth-child(12), .hazards-table td:nth-child(12) { width: 6%; } /* ნარჩენი რისკი */
          .hazards-table th:nth-child(13), .hazards-table td:nth-child(13) { width: 5%; } /* ალბათობა */
          .hazards-table th:nth-child(14), .hazards-table td:nth-child(14) { width: 5%; } /* სიმძიმე */
          .hazards-table th:nth-child(15), .hazards-table td:nth-child(15) { width: 5%; } /* ნამრავლი */
          .hazards-table th:nth-child(16), .hazards-table td:nth-child(16) { width: 8%; } /* საჭირო */
          .hazards-table th:nth-child(17), .hazards-table td:nth-child(17) { width: 8%; } /* პასუხისმგებელი */
          .hazards-table th:nth-child(18), .hazards-table td:nth-child(18) { width: 6%; } /* თარიღი */
          
          .section-title { 
            font-size: 12px; 
            font-weight: bold; 
            margin: 15px 0 8px 0; 
          }
          
          @page {
            size: A4 landscape;
            margin: 10mm;
          }
          
          @media print {
            body { font-size: 8px; }
            .hazards-table { font-size: 7px; }
            .hazards-table th { font-size: 6px; }
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

async function testHTML() {
  try {
    console.log('📄 იწყება HTML ტესტი...');

    const html = generateHTMLReport(testDocument);

    // ფაილის შენახვა
    fs.writeFileSync('test-output-pdf.html', html);

    console.log('✅ HTML წარმატებით შეიქმნა!');
    console.log('📁 ფაილი შენახულია: test-output-pdf.html');
    console.log('🌐 გახსენი ბრაუზერში PDF ფორმატის შესამოწმებლად');
    console.log('📊 ამ HTML-ს იყენებს PDF generator ქართული ფონტებით');
  } catch (error) {
    console.error('❌ HTML შექმნისას მოხდა შეცდომა:', error.message);
    console.error('🔍 დეტალები:', error);
  }
}

testHTML();
