export type SpreadSheetValue = string | number | Date | null;

export type ArrayToWritable<T> = T extends ReadonlyArray<infer E> ? E[] : T;
export type Writable<T> = {-readonly [P in keyof T]: ArrayToWritable<T[P]>};

export interface ConverterDefinition<RawItem, StoredItem> {
  readonly label: string;
  readonly rawToSpread: (worklog: RawItem) => string | number | Date;
  readonly spreadToStored: (worklog: Partial<Writable<StoredItem>>, value: SpreadSheetValue | undefined) => void;
}

export class ConverterBase<RawItem, StoredItem> {
  public constructor(public readonly definitions: readonly ConverterDefinition<RawItem, StoredItem>[]) {}

  public rawToSpread(raw: RawItem): SpreadSheetValue[] {
    return this.definitions.map((definition) => definition.rawToSpread(raw));
  }

  public spreadToStored(spreadValues: readonly SpreadSheetValue[]): StoredItem {
    const storeadItem: Partial<Writable<StoredItem>> = {};
    this.definitions.forEach((definition, index) => definition.spreadToStored(storeadItem, spreadValues[index]));
    return storeadItem as StoredItem;
  }
}

export class ConveterFunctions {
  public static parseNumber(label: string, required: true, value: SpreadSheetValue | undefined): number;
  public static parseNumber(label: string, required: false, value: SpreadSheetValue | undefined): number | undefined;
  public static parseNumber(label: string, required: boolean, value: SpreadSheetValue | undefined): number | undefined {
    if (value === null || value === undefined || value === '') {
      if (required) {
        throw new Error(`必須項目の${label}が入力されていません。`);
      } else {
        return undefined;
      }
    }
    if (typeof value !== 'number') {
      throw new Error(`${label}の型が不正です。 ${typeof value} ${value?.toString() ?? 'undefined'}`);
    }
    return value;
  }

  public static parseString(label: string, required: true, value: SpreadSheetValue | undefined): string;
  public static parseString(label: string, required: false, value: SpreadSheetValue | undefined): string | undefined;
  public static parseString(label: string, required: boolean, value: SpreadSheetValue | undefined): string | undefined {
    if (value === null || value === undefined || value === '') {
      if (required) {
        throw new Error(`必須項目の${label}が入力されていません。`);
      } else {
        return undefined;
      }
    }
    if (typeof value !== 'string') {
      throw new Error(`${label}の型が不正です。 ${typeof value} ${value?.toString() ?? 'undefined'}`);
    }
    return value;
  }

  public static parseTime(label: string, required: true, value: SpreadSheetValue | undefined): string;
  public static parseTime(label: string, required: false, value: SpreadSheetValue | undefined): string | undefined;
  public static parseTime(label: string, required: boolean, value: SpreadSheetValue | undefined): string | undefined {
    if (value === null || value === undefined || value === '') {
      if (required) {
        throw new Error(`必須項目の${label}が入力されていません。`);
      } else {
        return undefined;
      }
    }
    if (!(value instanceof Date)) {
      throw new Error(`${label}の型が不正です。 ${typeof value} ${value?.toString() ?? 'undefined'}`);
    }
    return Utilities.formatDate(value, 'JST', 'HH:mm');
  }

  public static parseDate(label: string, required: true, value: SpreadSheetValue | undefined): Date;
  public static parseDate(label: string, required: false, value: SpreadSheetValue | undefined): Date | undefined;
  public static parseDate(label: string, required: boolean, value: SpreadSheetValue | undefined): Date | undefined {
    if (value === null || value === undefined || value === '') {
      if (required) {
        throw new Error(`必須項目の${label}が入力されていません。`);
      } else {
        return undefined;
      }
    }
    if (!(value instanceof Date)) {
      throw new Error(`${label}の型が不正です。 ${typeof value} ${value?.toString() ?? 'undefined'}`);
    }
    return value;
  }
}
