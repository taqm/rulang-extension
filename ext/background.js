/* global chrome */

chrome.contextMenus.create({
  title : 'ルー語に翻訳',
  type  : 'normal',
  contexts : ['selection'],
  onclick(info, tab) {
    chrome.tabs.sendRequest(tab.id, {})
  }
})
