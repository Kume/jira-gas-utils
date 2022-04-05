import {SheetBase} from './SheetBase';

interface ArraySettingItem<S> {
  key: keyof S;
  type: 'array';
  length: number;
  item: SettingItem<S>;
}

interface StringSettingItem {
  type: 'string';
}

interface TupleSettingItem<S> {
  type: 'tuple';
  items: (SettingItem<S> & {key: string})[];
}

type SettingItem<S> = StringSettingItem | TupleSettingItem<S>;
export type RootSettingItem<S> = (SettingItem<S> | ArraySettingItem<S>) & {label: string; key: keyof S};

export class SettingSheetBase<Settings extends Record<string, any>> {
  public readonly sheetBase = new SheetBase('設定', '設定');

  public constructor(private settingItems: readonly RootSettingItem<Settings>[]) {}

  public refresh(): void {
    const sheet = this.sheetBase.getOrCreateSheet();
    this.init(sheet, this.readSettings());
  }

  public init(sheet: GoogleAppsScript.Spreadsheet.Sheet, old: Partial<Settings> = {}): void {
    const rows: string[][] = [];
    for (const settingItem of this.settingItems) {
      switch (settingItem.type) {
        case 'string':
          rows.push([settingItem.label, (old[settingItem.key] as string) || '']);
          break;

        case 'array':
          for (let i = 0; i < settingItem.length; i++) {
            switch (settingItem.item.type) {
              case 'string':
                rows.push([`${settingItem.label} ${i + 1}`, old[settingItem.key]?.[i] || '']);
                break;

              case 'tuple': {
                const values = settingItem.item.items.map(({key}) => (old[settingItem.key] as any)?.[i]?.[key]);
                rows.push([`${settingItem.label} ${i + 1}`, ...values]);
              }
            }
          }
      }
    }
    const maxColumn = this.maxColumnSize();
    for (const row of rows) {
      while (row.length < maxColumn) {
        row.push('');
      }
    }
    sheet.getRange(1, 1, rows.length, maxColumn).setValues(rows);
  }

  public readSettings(): Partial<Settings> {
    const sheet = this.sheetBase.getOrCreateSheet();
    const settings: Partial<Settings> = {};
    const lastRow = sheet.getLastRow();
    if (lastRow === 0) {
      return {};
    }
    const range = sheet.getRange(1, 1, sheet.getLastRow(), this.maxColumnSize()).getValues();
    const labelValueMap: Map<string, any[]> = new Map();
    for (const row of range) {
      const [label, ...values] = row;
      if (typeof label === 'string') {
        labelValueMap.set(label, values);
      }
    }

    for (const settingItem of this.settingItems) {
      switch (settingItem.type) {
        case 'string': {
          const value = labelValueMap.get(settingItem.label);
          if (value && value[0]) {
            settings[settingItem.key] = value[0];
          }
          break;
        }

        case 'array': {
          const values: any[] = [];
          for (let i = 0; i < settingItem.length; i++) {
            const value = labelValueMap.get(`${settingItem.label} ${i + 1}`);
            switch (settingItem.item.type) {
              case 'string':
                if (value && value[0]) {
                  values[i] = value[0];
                }
                break;

              case 'tuple':
                if (value) {
                  const settingValue: any = {};
                  let hasValue = false;
                  settingItem.item.items.forEach((tupleItem, index) => {
                    settingValue[tupleItem.key] = value[index];
                    hasValue = hasValue || !!value[index];
                  });
                  if (hasValue) {
                    values[i] = settingValue;
                  }
                }
                break;
            }
          }
          if (values.length > 0) {
            settings[settingItem.key] = values as any;
          }
        }
      }
    }
    return settings;
  }

  private maxColumnSize(): number {
    let max = 2;
    for (const item of this.settingItems) {
      if (item.type === 'array' && item.item.type === 'tuple') {
        max = Math.max(max, item.item.items.length + 1);
      }
    }
    return max;
  }
}
