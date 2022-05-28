import {RootSettingItem, SettingSheetBase} from '../SpreadCommon/SettingSheetBase';

export interface Settings {
  jiraHost: string;
  project: string;
  members: {name: string; email: string; project: string}[];
  toEmails: string[];
  ccEmails: string[];
  startEmailSubjectTemplate?: string;
  startEmailContentTemplate?: string;
  endEmailSubjectTemplate?: string;
  endEmailContentTemplate?: string;
}

const settingItems: RootSettingItem<Settings>[] = [
  {key: 'jiraHost', label: 'JIRAホスト(https://xxxx.atlassian.net)', type: 'string'},
  {key: 'project', label: '共通プロジェクト', type: 'string'},
  {
    key: 'members',
    label: 'メンバー(名前、email、個別pj)',
    type: 'array',
    length: 20,
    item: {
      type: 'tuple',
      items: [
        {type: 'string', key: 'name'},
        {type: 'string', key: 'email'},
        {type: 'string', key: 'project'},
      ],
    },
  },
  {key: 'startEmailSubjectTemplate', label: '業務開始タイトル', type: 'string'},
  {key: 'startEmailContentTemplate', label: '業務開始テンプレ', type: 'string'},
  {key: 'endEmailSubjectTemplate', label: '業務終了タイトル', type: 'string'},
  {key: 'endEmailContentTemplate', label: '業務終了テンプレ', type: 'string'},
  {key: 'toEmails', label: 'メールアドレス(to)', type: 'array', length: 5, item: {type: 'string'}},
  {key: 'ccEmails', label: 'メールアドレス(cc)', type: 'array', length: 5, item: {type: 'string'}},
];

type ItemTypeOf<T> = T extends readonly (infer V)[] ? V : never;

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

  public static selfName(settings: Partial<Settings>): string {
    return this.selfMember(settings).name;
  }

  public static selfMember(settings: Partial<Settings>): ItemTypeOf<Settings['members']> {
    const myEmail = Session.getActiveUser().getEmail();
    if (!settings.members) {
      throw new Error('メンバーの設定がありません。');
    }
    for (const member of settings.members) {
      if (member.email === myEmail) {
        return member;
      }
    }
    throw new Error('メンバー設定に自身のメールアドレス[' + myEmail + ']が設定されていません。');
  }

  public static myProject(settings: Partial<Settings>): string[] {
    const projects: string[] = [];
    if (settings.project) {
      projects.push(...settings.project.split(',').map((p) => p.trim()));
    }
    const member = this.selfMember(settings);
    if (member.project) {
      projects.push(...member.project.split(',').map((p) => p.trim()));
    }
    return projects;
  }
}
