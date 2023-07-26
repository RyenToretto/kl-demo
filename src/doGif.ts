import DoRecorder from './doRecorder'
import { drawGifFrame, getGifDurationFromFrames, getImageDataArray } from './imageProcessing'
import { getGifParsed } from './gifParser'
import type { Payload } from './types'

const doGif = (payload: Payload) => {
  const { canvas, gifSource, imageURL, faDownload } = payload
  if (!canvas || !gifSource || !imageURL) {
    return
  }
  const recorder = new DoRecorder(canvas, faDownload)
  const ctxCanvas = canvas.getContext('2d') as CanvasRenderingContext2D

  let widthGif
  let heightGif
  let isGifLoaded = false
  let isImageLoaded = false

  let currentFrame = 0
  let gifDuration = 0
  let gifImageDataArray: ImageData[] = []

  // 获取 GIF 图像数据
  getGifParsed(gifSource, (parsedGif) => {
    gifDuration = getGifDurationFromFrames(parsedGif.frames) // 计算 GIF 图像的持续时间
    gifImageDataArray = getImageDataArray(ctxCanvas, parsedGif) // 获取图像数据数组
  })

  // 检查并开始渲染 GIF 帧数据
  const checkAndRenderFrame = () => {
    if (isImageLoaded && isGifLoaded) {
      // 设置 Canvas 元素的宽度和高度为 Gif 的宽度和高度
      canvas.width = widthGif
      canvas.height = heightGif

      // 计算每一帧的时间间隔
      const gifInterval = (gifDuration / gifImageDataArray.length) * 1000

      // 定义用于渲染 GIF 帧数据的函数
      const renderFrame = () => {
        if (currentFrame < recorder.fps * gifDuration) {
          // 当前帧小于总帧数时，继续渲染
          ctxCanvas.clearRect(0, 0, canvas.width, canvas.height) // 清除 Canvas，准备绘制下一帧
          drawGifFrame(ctxCanvas, gifImageDataArray[currentFrame % gifImageDataArray.length]) // 绘制 GIF 帧数据
          currentFrame++ // 增加当前帧索引
          ctxCanvas.drawImage(
            eleImage,
            canvas.width / 2,
            canvas.height / 2,
            canvas.width / 2,
            canvas.height / 2
          ) // 绘制背景图像
          setTimeout(renderFrame, gifInterval) // 延迟一定时间后渲染下一帧
        } else {
          recorder.stop()
        }
      }

      recorder.start()
      renderFrame() // 开始渲染 GIF 帧数据
    }
  }

  const eleGif = new Image()
  const eleImage = new Image()
  eleGif.onload = () => {
    isGifLoaded = true
    widthGif = eleGif.width
    heightGif = eleGif.height
    checkAndRenderFrame()
  }
  eleImage.onload = () => {
    isImageLoaded = true
    checkAndRenderFrame()
  }
  eleImage.src = imageURL
  eleGif.src =
    typeof gifSource === 'object' ? URL.createObjectURL(new Blob([gifSource])) : gifSource
}
export default doGif
