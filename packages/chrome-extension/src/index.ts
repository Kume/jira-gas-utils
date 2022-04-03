const inputElement = document.querySelector('input[name=q]');
if (inputElement instanceof HTMLInputElement) {
  chrome.storage.local.get(['testValue']).then((values) => {
    console.log('xxxx --', values);
    inputElement.value = values.testValue;
  });
}
