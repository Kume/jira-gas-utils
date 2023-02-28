import {parseTsv} from './utils';
import React, {useCallback} from 'react';
import ReactDOM from 'react-dom';
import dayjs from 'dayjs';

function parseDate(source: string): string {
  return dayjs(source).format('YYYY/MM/DD');
}

function parseProject(source: string): string {
  if (!/^[0-9a-zA-Z_-]+$/.test(source)) {
    throw new Error(`プロジェクトコード [${source}] は不正な入力です。`);
  }
  return source;
}

function parseGroup(source: string): string {
  if (!/^[0-9]{3}$/.test(source)) {
    throw new Error(`内訳 [${source}] は不正な入力です。`);
  }
  return source;
}

function parseTime(source: string): number {
  const value = Number.parseFloat(source);
  if (Number.isFinite(value)) {
    return value;
  } else {
    throw new Error(`時刻 [${source}] は不正な入力です。`);
  }
}

function parseRows(rawRows: ReadonlyArray<ReadonlyArray<string>>): {readonly [key: string]: readonly InputRow[]} {
  const byDate: {[key: string]: InputRow[]} = {};

  for (const sourceRow of rawRows) {
    const date = parseDate(sourceRow[0]);
    const row = byDate[date] ?? (byDate[date] = []);
    row.push({
      project: parseProject(sourceRow[1]),
      group: parseGroup(sourceRow[2]),
      time: parseTime(sourceRow[3]),
      description: sourceRow[4],
    });
  }

  return byDate;
}

const App = () => {
  // const submit = useCallback(() => {}, []);
  const paste = useCallback((e: React.ClipboardEvent<HTMLInputElement>) => {
    try {
      const input = parseTsv(e.clipboardData.getData('text'));
      const saveData: SavedData = {input: parseRows(input)};
      chrome.storage.local.set(saveData);
    } catch (error) {
      alert(error);
    }
  }, []);
  return (
    <div>
      <p>↓ここにペースト↓</p>
      <input id="paste_box" onPaste={paste}></input>
      {/* <button id="submit_button" onClick={submit}>
        決定
      </button> */}
    </div>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);
