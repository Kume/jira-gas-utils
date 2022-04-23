import {RootSettingItem, SettingSheetBase} from '../SpreadCommon/SettingSheetBase';

interface Settings {
  jiraHost: string;
  members: {name: string; email: string}[];
}

const settingItems: RootSettingItem<Settings>[] = [
  {key: 'jiraHost', label: 'JIRAホスト(https://xxxx.atlassian.net)', type: 'string'},
  {
    key: 'members',
    label: 'メンバー(名前、email)',
    type: 'array',
    length: 20,
    item: {
      type: 'tuple',
      items: [
        {type: 'string', key: 'name'},
        {type: 'string', key: 'email'},
      ],
    },
  },
];

export class SettingSheet {
  private base: SettingSheetBase<Settings>;

  public constructor() {
    this.base = new SettingSheetBase(settingItems);
  }

  public refresh(): void {
    this.base.refresh();
  }

  public getSettings(): Partial<Settings> {
    return this.base.readSettings();
  }
}
