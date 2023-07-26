import waitUpload from './waitUpload'
import doGif from './doGif'
import type { Payload } from '@/types'

window.addEventListener('DOMContentLoaded', async () => {
  const payload: Partial<Payload> = { faDownload: '.merge-result-list' }
  waitUpload('uploader-image', payload as Payload)
  waitUpload('uploader-photo-gif', payload as Payload, true)

  const eleMerge = document.getElementById('demo-merge') as HTMLButtonElement
  eleMerge &&
    eleMerge.addEventListener('click', () => {
      if (!payload.imageURL || !payload.gifSource) {
        return
      }

      payload.canvas = document.getElementById('canvas') as HTMLCanvasElement
      doGif(payload as Payload)
    })
})
