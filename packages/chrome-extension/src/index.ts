// const browser = require('webextension-polyfill');

import {parseTsv} from './utils';

console.log('xxxx', chrome);
// chrome.clipboard.data = 'xxxx';

const inputElement = document.querySelector('input[name=q]');
if (inputElement instanceof HTMLInputElement) {
  chrome.storage.local.get(['testValue']).then((values) => {
    console.log('xxxx --', values);
    inputElement.value = values.testValue;
  });
}

(async () => {
  try {
    console.log('start writeText');
    await navigator.clipboard.writeText('xxxx');
    setTimeout(() => {
      console.log('start writeText2');
      navigator.clipboard.writeText('yyyy');
    }, 10000);
  } catch (error) {
    console.error('error!!!!');
    console.error(error);
  }
})();

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  console.log('on message', message, sender, sendResponse);
  sendResponse('hellow');
  const text = await navigator.clipboard.readText();
  const parsed = parseTsv(text);
  console.log('clip board text', text);
});
