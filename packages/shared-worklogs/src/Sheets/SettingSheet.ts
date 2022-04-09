import {RootSettingItem, SettingSheetBase} from '../SpreadCommon/SettingSheetBase';

interface Settings {
  jiraHost: string;
  email: string;
}

const settingItems: RootSettingItem<Settings>[] = [
  {key: 'jiraHost', label: 'JIRAホスト(https://xxxx.atlassian.net)', type: 'string'},
  {key: 'email', label: 'メールアドレス', type: 'string'},
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
