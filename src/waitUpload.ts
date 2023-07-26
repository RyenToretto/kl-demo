import type { Payload } from '@/types'

const waitUpload = (imgSrc, payload: Payload, useBuffer = false) => {
  const eleImageUploader = document.getElementById(imgSrc) as HTMLInputElement
  if (!eleImageUploader) {
    return
  }

  eleImageUploader.addEventListener('change', (uploadEvent: Event) => {
    const fileInput = uploadEvent.target as HTMLInputElement
    if (fileInput.files && fileInput.files[0]) {
      if (fileInput.parentElement && fileInput.parentElement.parentElement) {
        const eleLabel = fileInput.parentElement.parentElement.querySelector(
          `.${fileInput.parentElement.className}+div`
        ) as HTMLDivElement
        eleLabel.innerText = fileInput.files[0].name
      }
      const fileReader = new FileReader()
      fileReader.onload = (res: ProgressEvent<FileReader>) => {
        if (res.target) {
          if (useBuffer) {
            payload.gifSource = res.target.result as ArrayBuffer
          } else {
            payload.imageURL = res.target.result as string
          }
        }
      }
      if (useBuffer) {
        fileReader.readAsArrayBuffer(fileInput.files[0])
      } else {
        fileReader.readAsDataURL(fileInput.files[0])
      }
    }
  })
}

export default waitUpload
