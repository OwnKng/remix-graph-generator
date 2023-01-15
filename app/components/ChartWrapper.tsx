import { ParentSize } from "@visx/responsive"
import LineChart from "./LineChart"
import { useRef } from "react"

export default function ChartWrapper(props: any) {
  const ref = useRef(null!)

  return (
    <div>
      <div className='flex flex-col w-full py-4 items-center shadow bg-slate-500'>
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
