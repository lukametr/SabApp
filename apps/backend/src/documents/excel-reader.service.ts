import { Injectable, BadRequestException } from '@nestjs/common';
import * as ExcelJS from 'exceljs';

export interface ExcelAnalysisResult {
  fileName: string;
  sheetCount: number;
  sheets: {
    name: string;
    rowCount: number;
    columnCount: number;
    data: any[][];
    headers: string[];
    summary: {
      totalCells: number;
      emptyCells: number;
      filledCells: number;
      dataTypes: {
        string: number;
        number: number;
        date: number;
        boolean: number;
        formula: number;
      };
    };
  }[];
  metadata: {
    creator?: string;
    created?: Date;
    modified?: Date;
    properties?: any;
  };
}

@Injectable()
export class ExcelReaderService {
  /**
   * Excel ფაილის წაკითხვა და ანალიზი
   */
  async readAndAnalyzeExcel(
    buffer: Buffer,
    fileName: string,
  ): Promise<ExcelAnalysisResult> {
    try {
      const workbook = new ExcelJS.Workbook();

      // Buffer-დან Excel ფაილის წაკითხვა
      await workbook.xlsx.load(buffer);

      const result: ExcelAnalysisResult = {
        fileName,
        sheetCount: workbook.worksheets.length,
        sheets: [],
        metadata: {
          creator: workbook.creator,
          created: workbook.created,
          modified: workbook.modified,
          properties: workbook.properties,
        },
      };

      // ყველა Sheet-ის ანალიზი
      workbook.worksheets.forEach((worksheet) => {
        const sheetAnalysis = this.analyzeWorksheet(worksheet);
        result.sheets.push(sheetAnalysis);
      });

      console.log(`📊 Excel ანალიზი დასრულდა: ${fileName}`, {
        sheets: result.sheetCount,
        totalRows: result.sheets.reduce(
          (sum, sheet) => sum + sheet.rowCount,
          0,
        ),
        totalCells: result.sheets.reduce(
          (sum, sheet) => sum + sheet.summary.totalCells,
          0,
        ),
      });

      return result;
    } catch (error) {
      console.error('❌ Excel წაკითხვის შეცდომა:', error);
      throw new BadRequestException(
        `Excel ფაილის წაკითხვა ვერ მოხერხდა: ${error.message}`,
      );
    }
  }

  /**
   * ცალკეული Worksheet-ის ანალიზი
   */
  private analyzeWorksheet(worksheet: ExcelJS.Worksheet) {
    const data: any[][] = [];
    const headers: string[] = [];
    let rowCount = 0;
    let columnCount = 0;

    const summary = {
      totalCells: 0,
      emptyCells: 0,
      filledCells: 0,
      dataTypes: {
        string: 0,
        number: 0,
        date: 0,
        boolean: 0,
        formula: 0,
      },
    };

    // Headers-ის მოძებნა (პირველი სტრიქონი)
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell, colNumber) => {
      headers[colNumber - 1] = cell.text || `Column ${colNumber}`;
      columnCount = Math.max(columnCount, colNumber);
    });

    // ყველა სტრიქონის წაკითხვა
    worksheet.eachRow((row, rowNumber) => {
      const rowData: any[] = [];
      rowCount = Math.max(rowCount, rowNumber);

      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        summary.totalCells++;

        let cellValue = cell.value;

        // Cell-ის ტიპის განსაზღვრა
        if (cellValue === null || cellValue === undefined || cellValue === '') {
          summary.emptyCells++;
          cellValue = null;
        } else {
          summary.filledCells++;

          // ტიპის კლასიფიკაცია
          if (cell.type === ExcelJS.ValueType.String) {
            summary.dataTypes.string++;
          } else if (cell.type === ExcelJS.ValueType.Number) {
            summary.dataTypes.number++;
          } else if (cell.type === ExcelJS.ValueType.Date) {
            summary.dataTypes.date++;
            cellValue = new Date(cellValue as Date).toISOString();
          } else if (cell.type === ExcelJS.ValueType.Boolean) {
            summary.dataTypes.boolean++;
          } else if (cell.type === ExcelJS.ValueType.Formula) {
            summary.dataTypes.formula++;
            cellValue = cell.result || cell.formula;
          }
        }

        rowData[colNumber - 1] = cellValue;
        columnCount = Math.max(columnCount, colNumber);
      });

      data.push(rowData);
    });

    return {
      name: worksheet.name,
      rowCount,
      columnCount,
      data,
      headers,
      summary,
    };
  }

  /**
   * Excel ფაილიდან კონკრეტული მონაცემების ექსტრაქტი
   */
  async extractSpecificData(
    buffer: Buffer,
    sheetName?: string,
    startRow?: number,
    endRow?: number,
    columns?: string[],
  ): Promise<any[]> {
    try {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(buffer);

      // Sheet-ის მოძებნა
      const worksheet = sheetName
        ? workbook.getWorksheet(sheetName)
        : workbook.worksheets[0];

      if (!worksheet) {
        throw new BadRequestException(`Sheet '${sheetName}' ვერ მოიძებნა`);
      }

      const result: any[] = [];
      const headers: string[] = [];

      // Headers-ის წაკითხვა პირველი სტრიქონიდან
      const headerRow = worksheet.getRow(1);
      headerRow.eachCell((cell, colNumber) => {
        headers[colNumber - 1] = cell.text || `Column ${colNumber}`;
      });

      // მონაცემების წაკითხვა
      const start = startRow || 2; // Header-ის შემდეგ
      const end = endRow || worksheet.rowCount;

      for (let rowNumber = start; rowNumber <= end; rowNumber++) {
        const row = worksheet.getRow(rowNumber);
        const rowData: any = {};

        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
          const columnName = headers[colNumber - 1];

          // თუ კონკრეტული სვეტები არის მითითებული
          if (columns && !columns.includes(columnName)) {
            return;
          }

          let value = cell.value;

          // ტიპის მიხედვით კონვერტაცია
          if (cell.type === ExcelJS.ValueType.Date) {
            value = new Date(value as Date).toISOString();
          } else if (cell.type === ExcelJS.ValueType.Formula) {
            value = cell.result;
          }

          rowData[columnName] = value;
        });

        // ცარიელი სტრიქონების გამოტოვება
        if (
          Object.values(rowData).some(
            (val) => val !== null && val !== undefined && val !== '',
          )
        ) {
          result.push(rowData);
        }
      }

      console.log(`📊 მონაცემები ექსტრაქტი: ${result.length} სტრიქონი`);
      return result;
    } catch (error) {
      console.error('❌ მონაცემების ექსტრაქტის შეცდომა:', error);
      throw new BadRequestException(
        `მონაცემების ექსტრაქტი ვერ მოხერხდა: ${error.message}`,
      );
    }
  }

  /**
   * Excel ფაილის სტრუქტურის მარტივი ანალიზი
   */
  async getExcelStructure(buffer: Buffer): Promise<{
    sheets: { name: string; rows: number; columns: number }[];
    hasHeaders: boolean;
    possibleDataTypes: string[];
  }> {
    try {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(buffer);

      const sheets = workbook.worksheets.map((ws) => ({
        name: ws.name,
        rows: ws.rowCount,
        columns: ws.columnCount,
      }));

      // პირველი sheet-ის მიხედვით ანალიზი
      const firstSheet = workbook.worksheets[0];
      const possibleDataTypes: Set<string> = new Set();
      let hasHeaders = false;

      if (firstSheet && firstSheet.rowCount > 0) {
        // Headers-ის შემოწმება
        const firstRow = firstSheet.getRow(1);

        firstRow.eachCell((cell) => {
          if (cell.type === ExcelJS.ValueType.String && cell.text) {
            hasHeaders = true;
          }
        });

        // მონაცემების ტიპების ანალიზი
        for (
          let rowNum = hasHeaders ? 2 : 1;
          rowNum <= Math.min(firstSheet.rowCount, 10);
          rowNum++
        ) {
          const row = firstSheet.getRow(rowNum);
          row.eachCell((cell) => {
            switch (cell.type) {
              case ExcelJS.ValueType.String:
                possibleDataTypes.add('text');
                break;
              case ExcelJS.ValueType.Number:
                possibleDataTypes.add('number');
                break;
              case ExcelJS.ValueType.Date:
                possibleDataTypes.add('date');
                break;
              case ExcelJS.ValueType.Boolean:
                possibleDataTypes.add('boolean');
                break;
              default:
                possibleDataTypes.add('mixed');
            }
          });
        }
      }

      return {
        sheets,
        hasHeaders,
        possibleDataTypes: Array.from(possibleDataTypes),
      };
    } catch (error) {
      console.error('❌ Excel სტრუქტურის ანალიზის შეცდომა:', error);
      throw new BadRequestException(
        `Excel სტრუქტურის ანალიზი ვერ მოხერხდა: ${error.message}`,
      );
    }
  }

  /**
   * Excel-დან JSON-ის გენერაცია
   */
  async convertToJSON(buffer: Buffer, sheetName?: string): Promise<any[]> {
    const data = await this.extractSpecificData(buffer, sheetName);
    return data;
  }

  /**
   * Excel ფაილის ვალიდაცია
   */
  validateExcelFile(buffer: Buffer, maxSizeInMB: number = 10): boolean {
    if (buffer.length > maxSizeInMB * 1024 * 1024) {
      throw new BadRequestException(`ფაილის ზომა ${maxSizeInMB}MB-ზე მეტია`);
    }

    // Excel ფაილის სიგნატურის შემოწმება
    const excelSignatures = [
      [0x50, 0x4b, 0x03, 0x04], // .xlsx (ZIP format)
      [0xd0, 0xcf, 0x11, 0xe0], // .xls (OLE format)
    ];

    const fileHeader = Array.from(buffer.slice(0, 4));
    const isValidExcel = excelSignatures.some((signature) =>
      signature.every((byte, index) => byte === fileHeader[index]),
    );

    if (!isValidExcel) {
      throw new BadRequestException('არასწორი Excel ფაილის ფორმატი');
    }

    return true;
  }
}
