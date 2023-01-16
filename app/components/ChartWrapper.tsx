import { ParentSize } from "@visx/responsive"
import LineChart from "./LineChart"
import { useRef } from "react"
import { useDownloadableSvg } from "~/hooks/useDownloadableSvg"

export default function ChartWrapper(props: any) {
  const ref = useRef<SVGElement>(null!)
  const [url, generateLink] = useDownloadableSvg()

  return (
    <div>
      <div className='flex flex-col w-full py-4 items-center'>
        <div className='flex justify-between w-full max-w-[720px] py-2'>
          <h2 className='size-xl text-white font-bold'>{props.indicator}</h2>
          <div className='flex flex-col items-end'>
            <button
              className='bg-emerald-500 px-4 py-2 min-w-12 w-fit shadow-sm rounded text-slate-200'
              onClick={() => generateLink(ref.current)}
            >
              Export
            </button>
            {url && (
              <a
                download={true}
                href={url}
                className='text-emerald-500 underline'
              >
                Click to download
              </a>
            )}
          </div>
        </div>
        <div className='w-full h-[450px] max-w-[720px]'>
          <ParentSize>
            {({ width, height }) => (
              <LineChart ref={ref} {...props} width={width} height={height} />
            )}
          </ParentSize>
        </div>
      </div>
    </div>
  )
}
