import { useState } from "react"

export const useDownloadableSvg = () => {
  const [url, setUrl] = useState("")

  const createUrl = (svgRef: SVGElement) => {
    // clone the incoming svg and add dthe xmlns attribute to it
    const clonedSvg = svgRef.cloneNode(true)
    clonedSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg")

    const svgData = new Blob([clonedSvg.outerHTML], {
      type: "image/svg+xml",
    })

    const b64str = window.URL.createObjectURL(svgData)

    const w = svgRef.clientWidth
    const h = svgRef.clientHeight

    const canvas = document.createElement("canvas")
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext("2d")

    const image = new Image()

    image.onload = () => {
      ctx.drawImage(image, 0, 0)

      URL.revokeObjectURL(b64str)
      setUrl(canvas.toDataURL())
    }

    image.src = b64str
  }

  return [url, createUrl]
}
