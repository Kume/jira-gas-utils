function inputToMap(input: {readonly [key: string]: readonly InputRow[]}): Map<string, Map<string, string>> {
  const map = new Map<string, Map<string, string>>();

  for (const dateKey of Object.keys(input)) {
    const mapForDate = new Map<string, string>();
    for (let i = 0; i < input[dateKey].length; i++) {
      const inputRow = input[dateKey][i];
      mapForDate.set(`id_${i}_input1`, inputRow.project);
      mapForDate.set(`id_${i}_input2`, inputRow.project);
      mapForDate.set(`id_${i}_input3`, inputRow.project);
      mapForDate.set(`id_${i}_input4`, inputRow.project);
    }
    map.set(dateKey, mapForDate);
  }

  return map;
}

(async () => {
  const input = (await chrome.storage.local.get('input')) as SavedData;

  const inputMap = inputToMap(input.input);

  let inputMapForDate: Map<string, string> | undefined;

  setInterval(() => {
    const currentDateInput = document.getElementById('xxxxxx');
    if (currentDateInput instanceof HTMLInputElement) {
      for (const [key, value] of inputMap) {
        if (currentDateInput.value.startsWith(key)) {
          inputMapForDate = value;
          break;
        }
      }
    }
  });

  document.addEventListener('focusin', (e) => {
    if (e.target instanceof HTMLInputElement) {
      const value = inputMapForDate?.get(e.target.id);
      if (value) {
        navigator.clipboard.writeText(value);
      }
    }
  });
})();
