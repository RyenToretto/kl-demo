const MimeType = 'video/webm'

class DoRecorder {
  canvas: HTMLCanvasElement
  mediaRecorder: MediaRecorder
  fps = 30 // 生成视频的帧率
  faDownload?: string | undefined | HTMLDivElement
  lastResourceId: string | null = null
  resourceMap: { [key: string]: Blob[] } = {}

  constructor(canvas: HTMLCanvasElement, faDownload: string | undefined) {
    this.faDownload = faDownload && (document.querySelector(faDownload) as HTMLDivElement)
    this.canvas = canvas
    const streamCanvas = this.canvas.captureStream(this.fps)
    this.mediaRecorder = new MediaRecorder(streamCanvas, { mimeType: MimeType })
    this.watchCanvas() // 监测 Canvas 帧转换为视频流
  }

  watchCanvas() {
    this.mediaRecorder.onstart = () => {
      this.lastResourceId = new Date(Date.now()).toLocaleString().replace(/\//g, '-')
    }
    this.mediaRecorder.ondataavailable = (event: BlobEvent) => {
      if (this.lastResourceId && event && event.data && event.data.size) {
        if (!this.resourceMap[this.lastResourceId]) {
          this.resourceMap[this.lastResourceId] = [event.data]
        } else {
          this.resourceMap[this.lastResourceId].push(event.data)
        }
      }
    }
    this.mediaRecorder.onstop = () => {
      this.updateFaDownload()
    }
  }

  start() {
    this.mediaRecorder.start()
  }

  stop() {
    this.mediaRecorder.stop()
  }

  appendResourceDom(resourceId) {
    if (!resourceId || !this.faDownload) {
      return
    }
    const eleFa = this.faDownload as HTMLDivElement
    if (!eleFa.classList.contains('active')) {
      eleFa.classList.add('active')
    }

    const ele = document.createElement('div')
    ele.classList.add('each-merge-result')
    ele.innerHTML = `<span>点击下载</span><span>${resourceId}</span>`
    ;(this.faDownload as HTMLDivElement).append(ele)
    ele.addEventListener('click', () => {
      this.save(resourceId)
    })
  }

  updateFaDownload() {
    if (!this.faDownload) {
      return
    }
    const resourceList = Object.entries(this.resourceMap).sort(
      (a, b) => Date.parse(a[0]) - Date.parse(b[0])
    )
    for (const [resourceId, eachResource] of resourceList) {
      if (eachResource && eachResource.length) {
        this.appendResourceDom(resourceId)
      }
    }
  }

  // 下载至本地
  save(resourceId = '') {
    const sId = resourceId || this.lastResourceId
    if (!sId || !this.resourceMap[sId] || !this.resourceMap[sId].length) {
      return
    }

    const eleA = document.createElement('a') as HTMLAnchorElement
    eleA.href = URL.createObjectURL(new Blob(this.resourceMap[sId], { type: MimeType }))
    eleA.download = `video_${sId.replace(/[./: ]/g, '_')}.webm`
    eleA.click()
  }
}

export default DoRecorder
