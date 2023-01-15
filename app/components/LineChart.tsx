/* eslint-disable react/display-name */
import { scaleLinear } from "@visx/scale"
import { extent } from "d3-array"
import { AxisBottom, AxisLeft } from "@visx/axis"
import { LinePath } from "@visx/shape"
import { curveLinear } from "@visx/curve"
import { forwardRef } from "react"

const defaultMargin = {
  top: 10,
  left: 40,
  right: 10,
  bottom: 40,
}

type LineChartType = {
  data: any[]
  width: number
  height: number
  x: string
  y: string
  margin?: {
    top: number
    bottom: number
    left: number
    right: number
  }
}

const LineChart = forwardRef(
  (
    { data, width, height, margin = defaultMargin, x, y }: LineChartType,
    ref
  ) => {
    // dimensions
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    // accessors
    const getX = (d: any) => d[x]
    const getY = (d: any) => d[y]

    // scales
    const xScale = scaleLinear({
      // @ts-ignore
      domain: extent(data, getX),
      range: [0, innerWidth],
    })

    const yScale = scaleLinear({
      // @ts-ignore
      domain: extent(data, getY),
      range: [innerHeight, 0],
    })

    // Return the visual

    return (
      <svg ref={ref} width={width} height={height}>
        <g transform={`translate(${margin.left},${margin.top})`}>
          <AxisBottom scale={xScale} top={innerHeight} />
          <AxisLeft scale={yScale} />
          <LinePath
            data={data}
            curve={curveLinear}
            x={(d) => xScale(getX(d))}
            y={(d) => yScale(getY(d))}
            stroke='#222'
            fill='transparent'
          />
        </g>
      </svg>
    )
  }
)

export default LineChart
