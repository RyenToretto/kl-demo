import { decompressFrame } from 'gifuct-js'

export const getGifDurationFromFrames = (gifFrames: any[]) => {
  let duration = 0
  for (const frame of gifFrames) {
    // 检查帧数据中是否存在 GCE（图形控制扩展）信息
    if (frame.gce) {
      duration += frame.gce.delay // 累计每一帧的延迟时间
    }
  }
  return duration / 100 // 将累计的延迟时间转换为秒，并返回
}

export const getImageDataArray = (
  context: CanvasRenderingContext2D,
  parsedGif: any
): ImageData[] => {
  // 筛选出只包含图像数据的帧
  const imageFrames = parsedGif.frames.filter((frame) => frame.image)

  // 对每一帧进行处理，返回图像数据数组
  return imageFrames.map((frame, index) => {
    // 获取帧的宽度和高度
    const width = frame.image.descriptor.width
    const height = frame.image.descriptor.height

    // 创建一个 imageData 对象
    const imageData = context.createImageData(width, height)

    // 使用 gifuct-js 库中的 decompressFrame 函数解压缩帧的像素数据
    const pixelData = decompressFrame(frame, parsedGif, index)

    // 创建 Uint8ClampedArray 数组用于存储像素数据
    const imageDataArray = new Uint8ClampedArray(width * height * 4)

    // 遍历像素数据，将颜色信息存储在 imageDataArray 中
    let dataIndex = 0
    for (let i = 0; i < pixelData.pixels.length; i++) {
      const colorIndex = pixelData.pixels[i]
      if (colorIndex >= 0 && colorIndex < pixelData.colorTable.length) {
        const color = pixelData.colorTable[colorIndex]
        imageDataArray[dataIndex] = color[0] ?? 0 // 红色分量
        imageDataArray[dataIndex + 1] = color[1] ?? 0 // 绿色分量
        imageDataArray[dataIndex + 2] = color[2] ?? 0 // 蓝色分量
      } else {
        imageDataArray[dataIndex] = 0 // 如果颜色未定义或超出范围，则默认为 0
        imageDataArray[dataIndex + 1] = 0
        imageDataArray[dataIndex + 2] = 0
      }
      imageDataArray[dataIndex + 3] = 255 // Alpha 分量 (255 表示完全不透明)
      dataIndex += 4
    }

    // 将 imageDataArray 的数据设置到 imageData 对象中
    imageData.data.set(imageDataArray)
    return imageData
  })
}

/**
 * 在 canvas 上绘制 GIF 图像的帧数据
 * @param context CanvasRenderingContext2D 上下文对象
 * @param imageData 图像数据对象
 */
export const drawGifFrame = (context: CanvasRenderingContext2D, imageData: ImageData) => {
  context.putImageData(imageData, 0, 0) // 将 imageData 绘制到 canvas 上
}
