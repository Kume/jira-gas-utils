interface InputRow {
  readonly project: string;
  readonly group: string;
  readonly time: number;
  readonly description: string;
}

interface SavedData {
  readonly input: {readonly [key: string]: readonly InputRow[]};
}

interface IndicateMessage {
  readonly type: 'indicate';
  readonly max?: number;
  readonly current?: number;
}
