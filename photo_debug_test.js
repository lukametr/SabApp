// Photo Excel test with B column only positioning
const ExcelJS = require('exceljs');
const fs = require('fs');

async function testPhotoPlacement() {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Test');

  // Sample header data
  const headerData = [
    ['რისკის შეფასების ფორმა №1'],
    [
      'შეფასებლის სახელი და გვარი:',
      'ლუკა კოდი',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      'თარიღი:',
      '2024-12-27',
    ],
    ['სამუშაო ობიექტის დასახელება:', 'ტესტ ობიექტი', '', '', '', '', '', '', '', 'დრო:', '14:30'],
    ['სამუშაოს დაწყების თარიღი:', 'ტესტ აღწერა'],
  ];

  // Add header data
  headerData.forEach((row, index) => {
    worksheet.addRow(row);
  });

  // Add table headers
  worksheet.addRow([]); // empty row
  const tableHeaders = [
    '№',
    'ფოტო',
    'რისკი',
    'სახიფათო ფაქტორი',
    'შედეგი',
    'ზღვრული მნიშვნელობა',
    'ღონისძიება',
    'ღონისძიების დრო',
    'პასუხისმგებელი',
    'შედეგი კონტროლის შემდეგ',
    'კონტროლის თარიღი',
    'გადაუწყვეტელი რისკი',
    'დასკვნა',
    'განტოლების კლასი',
    'კატეგორია',
    'რისკის ხარისხი',
    'მიღებული ზომები',
  ];
  worksheet.addRow(tableHeaders);

  // Add sample data with hazard photos
  const sampleData = [
    '1',
    '',
    'მაღალი რისკი',
    'ქიმიური ნივთიერება',
    '15 mg/m³',
    '10 mg/m³',
    'ვენტილაციის გაუმჯობესება',
    '2024-01-15',
    'უსაფრთხოების ინჟინერი',
    '8 mg/m³',
    '2024-01-20',
    'გადაწყვეტილი',
    'დაცულია',
    'A კლასი',
    'მაღალი',
    'საშუალო',
    'დაინერგა ზომები',
  ];
  worksheet.addRow(sampleData);

  // Test photo in B column (column index 1)
  const dataStartRow = headerData.length + 2; // after header and table header
  const testPhotoRow = dataStartRow;

  // Create a simple test image (small base64 PNG)
  const testImageBase64 =
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

  try {
    const imageId = workbook.addImage({
      base64: testImageBase64,
      extension: 'png',
    });

    // B column only positioning (range method)
    const range = `B${testPhotoRow}:B${testPhotoRow + 2}`;
    worksheet.addImage(imageId, range);

    // Set row heights for photo
    worksheet.getRow(testPhotoRow).height = 80;
    worksheet.getRow(testPhotoRow + 1).height = 80;
    worksheet.getRow(testPhotoRow + 2).height = 80;

    console.log(`✅ Added test photo in B column at range ${range}`);

    // Set column widths
    worksheet.getColumn(1).width = 5; // A column (№)
    worksheet.getColumn(2).width = 15; // B column (ფოტო) - wider for photos
    worksheet.getColumn(3).width = 20; // C column (რისკი)

    // Save test file
    await workbook.xlsx.writeFile(
      'c:\\Users\\lukacode\\Desktop\\saba_latest\\test_photo_b_column.xlsx'
    );
    console.log('✅ Test Excel file created: test_photo_b_column.xlsx');
  } catch (error) {
    console.error('❌ Error creating test photo:', error);
  }
}

testPhotoPlacement();
