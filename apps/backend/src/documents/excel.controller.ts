import { Controller, Post, UploadedFile, UseInterceptors, BadRequestException, Body, Get } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes } from '@nestjs/swagger';
import { ExcelReaderService } from './excel-reader.service';

@ApiTags('excel')
@Controller('excel')
export class ExcelController {
  constructor(private readonly excelReaderService: ExcelReaderService) {}

  @Post('analyze')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Excel ფაილის ანალიზი' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200, description: 'Excel ფაილი წარმატებით გაანალიზდა' })
  @ApiResponse({ status: 400, description: 'არასწორი ფაილი ან ფორმატი' })
  async analyzeExcel(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Excel ფაილი არ არის ატვირთული');
    }

    // ფაილის ვალიდაცია
    this.excelReaderService.validateExcelFile(file.buffer);

    console.log(`📊 Excel ანალიზი იწყება: ${file.originalname}`, {
      size: file.size,
      mimetype: file.mimetype
    });

    const analysis = await this.excelReaderService.readAndAnalyzeExcel(
      file.buffer, 
      file.originalname
    );

    return {
      success: true,
      message: 'Excel ფაილი წარმატებით გაანალიზდა',
      data: analysis
    };
  }

  @Post('structure')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Excel ფაილის სტრუქტურის ანალიზი' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200, description: 'სტრუქტურა წარმატებით გაანალიზდა' })
  async getExcelStructure(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Excel ფაილი არ არის ატვირთული');
    }

    this.excelReaderService.validateExcelFile(file.buffer);

    const structure = await this.excelReaderService.getExcelStructure(file.buffer);

    return {
      success: true,
      message: 'Excel სტრუქტურა წარმატებით გაანალიზდა',
      data: structure
    };
  }

  @Post('extract')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Excel-დან მონაცემების ექსტრაქტი' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200, description: 'მონაცემები წარმატებით ექსტრაქტი' })
  async extractData(
    @UploadedFile() file: Express.Multer.File,
    @Body() options: {
      sheetName?: string;
      startRow?: number;
      endRow?: number;
      columns?: string[];
    }
  ) {
    if (!file) {
      throw new BadRequestException('Excel ფაილი არ არის ატვირთული');
    }

    this.excelReaderService.validateExcelFile(file.buffer);

    console.log(`📊 მონაცემების ექსტრაქტი: ${file.originalname}`, options);

    const data = await this.excelReaderService.extractSpecificData(
      file.buffer,
      options.sheetName,
      options.startRow,
      options.endRow,
      options.columns
    );

    return {
      success: true,
      message: `${data.length} სტრიქონი წარმატებით ექსტრაქტი`,
      data: data,
      count: data.length
    };
  }

  @Post('to-json')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Excel-ის JSON-ად კონვერტაცია' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200, description: 'Excel წარმატებით კონვერტირდა JSON-ად' })
  async convertToJSON(
    @UploadedFile() file: Express.Multer.File,
    @Body('sheetName') sheetName?: string
  ) {
    if (!file) {
      throw new BadRequestException('Excel ფაილი არ არის ატვირთული');
    }

    this.excelReaderService.validateExcelFile(file.buffer);

    console.log(`📊 JSON კონვერტაცია: ${file.originalname}`, { sheetName });

    const jsonData = await this.excelReaderService.convertToJSON(file.buffer, sheetName);

    return {
      success: true,
      message: 'Excel წარმატებით კონვერტირდა JSON-ად',
      data: jsonData,
      count: jsonData.length,
      fileName: file.originalname,
      sheetName: sheetName || 'Sheet1'
    };
  }

  @Get('test')
  @ApiOperation({ summary: 'Excel Reader ტესტი' })
  async test() {
    return {
      success: true,
      message: 'Excel Reader მზადაა მუშაობისთვის',
      features: [
        'Excel ფაილების ანალიზი',
        'სტრუქტურის შემოწმება',
        'მონაცემების ექსტრაქტი',
        'JSON კონვერტაცია',
        'მრავალი Sheet-ის მხარდაჭერა',
        'მონაცემების ტიპების ანალიზი',
        'Headers-ის ავტომატური ამოცნობა'
      ],
      supportedFormats: ['.xlsx', '.xls'],
      maxFileSize: '10MB'
    };
  }
}
