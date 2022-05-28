import {StartWorkParams} from '../libs/types';
import {Settings} from '../Sheets/SettingSheet';

export class EMail {
  public static createStartWorkDraft(settings: Partial<Settings>, params: StartWorkParams): void {
    const {toEmails, ccEmails} = settings;
    const {emailTitle, emailContent} = params;
    if (toEmails?.length && emailTitle) {
      const cc = ccEmails?.join(', ');
      GmailApp.createDraft(toEmails.join(', '), emailTitle, emailContent ?? '', {cc});
    }
  }
}
