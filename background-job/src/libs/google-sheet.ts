import { GoogleSpreadsheet, GoogleSpreadsheetRow, GoogleSpreadsheetWorksheet } from 'google-spreadsheet';
import numbro from 'numbro';
import { dayjsUTC } from './dayjs';

/**
 * Type from google-spreadsheet package
 */
type RowCellData = string | number | boolean | Date;
type RawRowData = RowCellData[] | Record<string, RowCellData>;
export type HeaderType = 'string' | 'number' | 'date' | 'boolean';

type MapType<T> = T extends 'string'
  ? string
  : T extends 'number'
  ? number
  : T extends 'date'
  ? Date
  : T extends 'boolean'
  ? boolean
  : never;
type MapObject<T, NullType = null> = {
  [K in keyof T]: MapType<T[K]> | NullType;
};

export interface GoogleSheetRowClientOptions<Headers extends Record<string, HeaderType>> {
  pageSize: number;
  headers: Headers;
  skipRowKeyword?: string;
  /**
   * Header row number, default is 1
   */
  headerRow?: number;
}

/**
 * Google Sheet Row Client
 *
 */
export class GoogleSheetRowClient<Headers extends Record<string, HeaderType>> {
  private sheet!: GoogleSpreadsheetWorksheet;
  constructor(
    private doc: GoogleSpreadsheet,
    private sheetId: number,
    private options: GoogleSheetRowClientOptions<Headers>
  ) {}

  async prepare() {
    await this.doc.loadInfo();
    this.sheet = this.doc.sheetsById[this.sheetId];
    if (this.sheet === undefined || this.sheet === null) {
      throw new Error(`Sheet with id ${this.sheetId} not found`);
    }
    this.doc.resetLocalCache();
    await this.sheet.loadHeaderRow(this.options.headerRow ?? 1);
  }

  async append(row: Record<keyof Headers, unknown>) {
    await this.prepare();
    const rows = await this.sheet.getRows();
    await this.sheet.addRow(row as RawRowData);
    return {
      rowCount: rows.length,
    };
  }

  /**
   * Note: This function is not optimized for large data, it might be block by rate limit
   *
   * TODO: Use binary search for large data
   */

  async update(rowId: string, newRow: Record<keyof Headers, unknown>) {
    await this.prepare();
    for await (const row of this.getRowsGenerator()) {
      if (String(row.get('Id')) === rowId) {
        row.assign(newRow);
        await row.save();
        break;
      }
    }
  }

  private processCell(
    row: GoogleSpreadsheetRow<Record<string, any>>,
    header: string,
    headerType: HeaderType
  ): {
    isSkip: boolean;
    value?: RowCellData | null;
  } {
    const cellValue = row.get(header);
    if (cellValue === this.options.skipRowKeyword) {
      return {
        isSkip: true,
      };
    }
    if (headerType === 'date') {
      return {
        isSkip: false,
        value: cellValue ? dayjsUTC(cellValue).toDate() : null,
      };
    }
    if (headerType === 'number') {
      return {
        isSkip: false,
        value: cellValue ? numbro(cellValue).value() : null,
      };
    }
    if (headerType === 'boolean') {
      return {
        isSkip: false,
        value: cellValue ? String(cellValue).trim().toUpperCase() === 'TRUE' : null,
      };
    }

    return {
      isSkip: false,
      value: String(cellValue).trim(),
    };
  }

  private processRow(row: GoogleSpreadsheetRow<Record<string, any>>) {
    const obj: Record<string, unknown> = {};
    let isSkip = false;
    for (const header of Object.keys(this.options.headers)) {
      const cellValue = this.processCell(row, header, this.options.headers[header]);
      if (cellValue.isSkip) {
        isSkip = true;
        break;
      }
      obj[header] = cellValue.value;
    }
    if (isSkip) return undefined;
    return obj;
  }

  /**
   * Use this function to get all rows from google sheet
   *
   * Support pagination and async generator
   */

  async *getRowsGenerator(): AsyncGenerator<GoogleSpreadsheetRow<Record<string, any>>, void, unknown> {
    await this.prepare();
    let isLoop = true;
    let offset = 0;
    while (isLoop) {
      const rows = await this.sheet.getRows({
        offset,
        limit: this.options.pageSize,
      });
      for (const row of rows) {
        yield row;
      }
      offset += this.options.pageSize;
      if (rows.length < this.options.pageSize) {
        isLoop = false;
      }
    }
  }

  async *readAll(): AsyncGenerator<MapObject<Headers>, void, unknown> {
    for await (const row of this.getRowsGenerator()) {
      const obj = this.processRow(row);
      if (obj) yield obj as MapObject<Headers>;
    }
  }

  async readAllArray(): Promise<MapObject<Headers>[]> {
    const result: MapObject<Headers>[] = [];
    for await (const row of this.readAll()) {
      result.push(row);
    }
    return result;
  }

  /**
   * Note: This function is not optimized for large data
   *
   */

  async getRowIds(): Promise<Set<string>> {
    await this.prepare();
    const ids = new Set<string>();
    for await (const row of this.readAll()) {
      const cellValue = String(row.Id);
      ids.add(cellValue);
    }
    return ids;
  }
}
