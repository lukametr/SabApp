const fs = require('fs');
const path = require('path');

// ტესტისთვის მარტივი base64 ფოტო (1x1 წითელი პიქსელი PNG)
const testPhotoBase64 =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAI9jU77zgAAAABJRU5ErkJggg==';

// ტესტისთვის მეორე ფოტო (1x1 ლურჯი პიქსელი PNG)
const testPhotoBase64_2 =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mMwEP4TDwAJoAH8P/M1PgAAAABJRU5ErkJggg==';

// ტესტური document JSON
const testDocument = {
  evaluatorName: 'ტესტური',
  evaluatorLastName: 'მუმრაჯი',
  objectName: 'ოფისი',
  workDescription: 'კომპიუტერებთან მუშაობა',
  date: new Date().toISOString(),
  time: new Date().toISOString(),
  hazards: [
    {
      hazardIdentification: 'კომპიუტერის ეკრანზე ხანგრძლივი მუშაობა',
      photos: [testPhotoBase64, testPhotoBase64_2],
      affectedPersons: ['თანამშრომელი 1', 'თანამშრომელი 2'],
      injuryDescription: 'თვალების დაღლა',
      existingControlMeasures: 'რეგულარული შესვენება',
      initialRisk: {
        probability: '3',
        severity: '2',
        total: '6',
      },
      additionalControlMeasures: 'ეკრანის კუთხე გასწორება',
      residualRisk: {
        probability: '2',
        severity: '2',
        total: '4',
      },
      requiredMeasures: 'ყოველ საათში 10 წუთიანი შესვენება',
      responsiblePerson: 'ოფის მენეჯერი',
      reviewDate: new Date().toISOString(),
    },
    {
      hazardIdentification: 'არასწორი ავეჯი',
      photos: [testPhotoBase64],
      affectedPersons: ['ყველა თანამშრომელი'],
      injuryDescription: 'ზურგის ტკივილი',
      existingControlMeasures: 'ერგონომიული სკამი',
      initialRisk: {
        probability: '4',
        severity: '3',
        total: '12',
      },
      additionalControlMeasures: 'ახალი სკამების ყიდვა',
      residualRisk: {
        probability: '2',
        severity: '2',
        total: '4',
      },
      requiredMeasures: 'ყველა სკამის შეცვლა',
      responsiblePerson: 'HR მენეჯერი',
      reviewDate: new Date().toISOString(),
    },
  ],
};

console.log('🧪 ტესტური document მონაცემები:');
console.log('📄 ანგარიშგება:', testDocument.objectName);
console.log('📸 საფრთხე 1 - ფოტოების რაოდენობა:', testDocument.hazards[0].photos.length);
console.log('📸 საფრთხე 2 - ფოტოების რაოდენობა:', testDocument.hazards[1].photos.length);
console.log('💾 JSON მზადაა POST request-ისთვის');

// JSON ფაილად შენახვა
fs.writeFileSync(path.join(__dirname, 'test_document.json'), JSON.stringify(testDocument, null, 2));
console.log('✅ ფაილი შენახულია: test_document.json');
