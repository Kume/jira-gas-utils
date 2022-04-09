import {RootSettingItem, SettingSheetBase} from './SpreadCommon/SettingSheetBase';

interface Settings {
  jiraHost: string;
}

const settingItems: RootSettingItem<Settings>[] = [
  {key: 'jiraHost', label: 'JIRAホスト(https://xxxx.atlassian.net)', type: 'string'},
];

export class SettingSheet {
  private base: SettingSheetBase<Settings>;

  public constructor() {
    this.base = new SettingSheetBase(settingItems);
  }

  public refresh(): void {
    this.base.refresh();
  }
}
