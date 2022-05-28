import {SettingsForFrontend, StartWorkFormValue, StartWorkWorkItem, WorkLocation} from '../libs/types';

export interface StartWorkEmailParameter {
  readonly now: Date;
  readonly name: string;
  readonly workMethod: string;
  readonly startAtTime: string;
  readonly workItems: string;
  readonly message?: string;
}

export class WorkEmail {
  static makeParameterForStart(params: StartWorkFormValue, settings: SettingsForFrontend): StartWorkEmailParameter {
    return {
      now: new Date(),
      name: settings.selfName,
      workMethod: this.workLocationToWorkMethod(params.location),
      startAtTime: params.startTime,
      message: params.messageForMeeting,
      workItems: this.workPlansToText(params.workItems),
    };
  }

  public static workLocationToWorkMethod(location: WorkLocation): string {
    switch (location) {
      case 'home':
        return 'テレワーク';
      case 'office':
        return '在宅勤務';
      default:
        return 'Error!!';
    }
  }

  private static workPlansToText(workItems: readonly StartWorkWorkItem[]): string {
    const lines: string[] = [];

    for (const workItem of workItems) {
      let issueTitleLine = workItem.issue.summary;
      if (workItem.time) {
        issueTitleLine = `${issueTitleLine} : (${workItem.time})`;
      }
      lines.push(issueTitleLine);

      if (workItem.content) {
        lines.push(
          ...workItem.content
            .trim()
            .split('\n')
            .map((line) => `    ${line}`),
        );
      }
    }

    return lines.join('\n');
  }
}
