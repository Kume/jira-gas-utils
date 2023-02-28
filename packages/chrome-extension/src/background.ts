// chrome.runtime.onInstalled.addListener(() => {
//   console.log('disable action 1');
//   chrome.action.disable();
//   console.log('disable action 2');

//   console.log('xxxx ', chrome.declarativeContent);
//   chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
//     console.log('removed');
//     chrome.declarativeContent.onPageChanged.addRules([
//       {
//         conditions: [
//           new chrome.declarativeContent.PageStateMatcher({
//             pageUrl: {hostEquals: 'www.google.com'},
//           }),
//         ],
//         actions: [new chrome.declarativeContent.ShowAction()],
//       },
//     ]);
//   });
// });

// chrome.action.onClicked.addListener((tab) => {
//   // chrome.action.setIcon({path: 'img/icon2.png'});
//   chrome.tabs.query({active: true, currentWindow: true}, async (tabs) => {
//     console.log('xxxx tabs', tabs);
//     const id = tabs[0]?.id;
//     if (typeof id === 'number') {
//       const result = await chrome.tabs.sendMessage(id, '');
//       console.log('xxxx get result', result);
//     }
//   });
// });

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  console.log('xxxx onMessage', message, sender);
});
