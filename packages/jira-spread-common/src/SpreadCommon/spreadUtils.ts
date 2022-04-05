export function refreshUserProperty(
  label: string,
  propertyName: string,
  validate?: (value: string) => string | undefined,
): string {
  const value = Browser.inputBox(`${label}を入力してください。`);
  if (!value || value === 'cancel') {
    throw new Error(`${label}が入力されなかったので処理を中断します。`);
  }
  if (validate) {
    const errorMessage = validate(value);
    if (errorMessage) {
      throw new Error(errorMessage);
    }
  }
  PropertiesService.getUserProperties().setProperty(propertyName, value);
  return value;
}

export function getOrInputUserProperty(
  label: string,
  propertyName: string,
  validate?: (value: string) => string | undefined,
): string {
  const token = PropertiesService.getUserProperties().getProperty(propertyName);
  return token ?? refreshUserProperty(label, propertyName, validate);
}

export function getStartOfDate(date: string | number | Date): Date {
  const start = new Date(date);
  start.setHours(0);
  start.setMinutes(0);
  start.setSeconds(0);
  start.setMilliseconds(0);
  return start;
}

export function getEndOfDate(date: string | number | Date): Date {
  const end = new Date(date);
  end.setHours(23);
  end.setMinutes(59);
  end.setSeconds(59);
  end.setMilliseconds(999);
  return end;
}

export function shuffle<T>(items: readonly T[]): T[] {
  return items
    .map((item) => ({item, sortOrder: Math.random()}))
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(({item}) => item);
}

export function inputStartEndDate(prompt: string): {startDate: Date; endDate: Date} {
  const input = Browser.inputBox(`${prompt}(format : yyyy/MM/dd-yyyy/MM/dd)`);
  if (!input || input === 'cancel') {
    throw new Error('対象の日付入力が無かったので処理を終了します。');
  }
  const inputs = input.split('-');
  const startDate = new Date(inputs[0]);
  const endDate = getEndOfDate(inputs[1]);
  Logger.log(`start-end = ${startDate.toString()} - ${endDate.toString()}`);
  return {startDate, endDate};
}
