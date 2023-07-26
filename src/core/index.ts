interface Payload {
  [key: string]: any
}

class AdxTrace {
  payload = {} as Payload

  constructor() {
    this.payload = (window as any).__payload as Payload
    delete (window as any).__payload
    this.doListen()
  }

  doListen() {
    window.addEventListener('DOMContentLoaded', () => {
      console.log('页面加载完成')
    })
  }
}
export default AdxTrace
