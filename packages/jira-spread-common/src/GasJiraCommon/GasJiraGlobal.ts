export interface GasJiraGlobal {
  readonly jiraHost: string;
}

let _gasJiraGlobal: GasJiraGlobal | undefined;

export function getGasJiraGlobal(): GasJiraGlobal {
  if (!_gasJiraGlobal) {
    throw new Error('GasJiraGlobal is not initialized');
  }
  return _gasJiraGlobal;
}

export function setGasJiraGlobal(value: GasJiraGlobal) {
  _gasJiraGlobal = value;
}
