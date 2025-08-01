const fs = require('fs');
const fetch = require('node-fetch');

async function testExcelPhotos() {
  try {
    console.log('🔐 1. Admin-ით შესვლა...');

    // 1. Admin login to get token
    const loginResponse = await fetch('http://localhost:10000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@saba.com',
        password: 'admin123',
      }),
    });

    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginResponse.status}`);
    }

    const loginData = await loginResponse.json();
    const token = loginData.token;
    console.log('✅ წარმატებით შევედით სისტემაში');

    console.log('📄 2. ტესტური document-ის შექმნა...');

    // 2. Read test document
    const testDocumentData = JSON.parse(fs.readFileSync('./test_document.json', 'utf8'));

    // 3. Create document
    const createResponse = await fetch('http://localhost:10000/api/documents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(testDocumentData),
    });

    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      throw new Error(`Document creation failed: ${createResponse.status} - ${errorText}`);
    }

    const newDocument = await createResponse.json();
    console.log('✅ ტესტური document შეიქმნა:', newDocument._id);
    console.log('📸 საფრთხეების რაოდენობა:', newDocument.hazards?.length || 0);

    // შეამოწმე ფოტოების რაოდენობა თითოეულ საფრთხეში
    if (newDocument.hazards) {
      newDocument.hazards.forEach((hazard, index) => {
        const photoCount = hazard.photos ? hazard.photos.length : 0;
        console.log(`📸 საფრთხე ${index + 1}: ${photoCount} ფოტო`);
      });
    }

    console.log('🚀 4. Excel ფაილის ტესტი...');

    // 4. Test Excel generation
    const excelResponse = await fetch(
      `http://localhost:10000/api/documents/${newDocument._id}/download/excel`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!excelResponse.ok) {
      const errorText = await excelResponse.text();
      throw new Error(`Excel generation failed: ${excelResponse.status} - ${errorText}`);
    }

    // Save Excel file for inspection
    const excelBuffer = await excelResponse.buffer();
    const filename = `test_photos_${newDocument._id}.xlsx`;
    fs.writeFileSync(filename, excelBuffer);

    console.log('✅ Excel ფაილი შენახულია:', filename);
    console.log('📊 ფაილის ზომა:', Math.round(excelBuffer.length / 1024), 'KB');
    console.log('🎯 შეამოწმეთ Excel ფაილი ფოტოების სწორი ჩამატებისთვის!');
  } catch (error) {
    console.error('❌ შეცდომა:', error.message);
  }
}

testExcelPhotos();
