import { ParentSize } from "@visx/responsive"
import LineChart from "./graphs/LineChart"
import AreaChart from "./graphs/AreaChart"
import { useRef } from "react"
import { useDownloadableSvg } from "~/hooks/useDownloadableSvg"

export default function ChartWrapper(props: any) {
  const ref = useRef<SVGElement>(null!)
  const [url, generateLink] = useDownloadableSvg()

  const nunmberOfCountries = [...new Set(props.data.map((d) => d.country))]
    .length

  return (
    <div>
      <div className='flex flex-col w-full py-4 items-center'>
        <div className='flex justify-between w-full max-w-[720px]'>
          <h2 className='size-l font-bold'>{props.indicator}</h2>
          <button onClick={() => generateLink(ref.current)}>Download</button>
          {url && (
            <a download={true} href={url}>
              Download
            </a>
          )}
        </div>
        <div className='w-full h-[450px] max-w-[720px]'>
          <ParentSize>
            {({ width, height }) => {
              return nunmberOfCountries === 1 ? (
                <AreaChart ref={ref} {...props} width={width} height={height} />
              ) : (
                <LineChart ref={ref} {...props} width={width} height={height} />
              )
            }}
          </ParentSize>
        </div>
      </div>
    </div>
  )
}
