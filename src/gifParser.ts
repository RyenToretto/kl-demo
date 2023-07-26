import { parseGIF } from 'gifuct-js'
import type { ParsedGif } from 'gifuct-js'

type ParsedCallback = (parsedGif: ParsedGif) => void

/**
 * 解析 GIF 图像，并通过回调函数返回解析后的数据
 * @param gifSource GIF 图像的 URL | Arraybuffer
 * @param callback 回调函数，接收解析后的 GIF 数据作为参数
 */
export const getGifParsed = (gifSource: ArrayBuffer | string, callback: ParsedCallback) => {
  if (typeof gifSource === 'object') {
    // 如果传入的是 Arraybuffer
    callback(parseGIF(new Uint8Array(gifSource)))
    return
  }
  // 如果传入的是 gif 资源路径

  // 创建 XMLHttpRequest 对象，用于发送异步请求获取 GIF 图像的二进制数据
  const xhr = new XMLHttpRequest()
  xhr.open('GET', gifSource, true)
  xhr.responseType = 'arraybuffer'
  xhr.onload = () => {
    // 将二进制数据转换为 Uint8Array
    // 再解析 GIF 图像数据
    callback(parseGIF(new Uint8Array(xhr.response)))
  }

  xhr.send()
}
