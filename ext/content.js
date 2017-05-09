/* global chrome */
/* global $ */

chrome.extension.onRequest.addListener(() => {
  const selection = window.getSelection()
  const text = selection.toString()
  const range = selection.getRangeAt(0)
  const rect = range.getBoundingClientRect()

  transform(text)
    .then(addDom.bind(null, rect))
    .catch(err => console.error(err))
})

// 翻訳APIキック
function transform(text) {
  const form = new FormData()
  form.append('text', text)
  return fetch('https://lou5.jp/api', {
    method: 'post',
    body: form
  }).then(res => res.text())
}

function addDom(rect, text) {
  const replaced = text.replace('\n', '<br>')
  const $dom = $(`
    <div>
      <div class="rulang-highlight"></div>
      <div class="rulang-label">
        <span class='rulang-close'>×</span>
        ${replaced}
      </div>
    </div>
  `)
  const remove = () => $dom.remove()
  const scrollTop = $(window).scrollTop()

  // 選択範囲のハイライト
  $dom.find('.rulang-highlight')
        .css(highlightCss(rect, scrollTop))

  // 翻訳後文字列吹き出し
  $dom.find('.rulang-label')
        .css(labelCss(rect, scrollTop))
        .dblclick(remove)

  // 閉じるボタン
  $dom.find('.rulang-close')
        .on('click', remove)

  $(document.body).append($dom)
}

function highlightCss ({ width, height, top, left }, scrollTop) {
  return {
    width,
    height,
    top: top + scrollTop,
    left
  }
}

function labelCss ({ width, bottom, left }, scrollTop) {
  const w = Math.max(width + 10, 200) // min-widht: 200px
  const ww = $(window).width()
  // 画面からはみ出す場合は調整
  const l = left + w < ww ? left : ww - w - 30
  return {
    top: bottom + scrollTop + 20,
    left: l,
    width: w
  }
}