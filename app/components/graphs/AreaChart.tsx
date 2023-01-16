/* eslint-disable react/display-name */
import { scaleLinear } from "@visx/scale"
import { extent } from "d3-array"
import { AxisBottom, AxisLeft } from "@visx/axis"
import { LinePath } from "@visx/shape"
import { curveLinear } from "@visx/curve"
import { forwardRef } from "react"
import { format } from "d3-format"
import { GridRows } from "@visx/grid"
import { motion } from "framer-motion"
import { Threshold } from "@visx/threshold"
import { Text } from "@visx/text"

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: () => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { type: "spring", duration: 1.5, bounce: 0 },
      opacity: { duration: 0.01 },
    },
  }),
}

const defaultMargin = {
  top: 15,
  left: 10,
  right: 10,
  bottom: 40,
}

type LineChartType = {
  data: any[]
  width: number
  height: number
  x: string
  y: string
  color: string
  margin?: {
    top: number
    bottom: number
    left: number
    right: number
  }
}

const AreaChart = forwardRef(
  (
    { data, width, height, margin = defaultMargin, x, y, color }: LineChartType,
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
      clamp: true,
    })

    const yScale = scaleLinear({
      // @ts-ignore
      domain: extent(data, getY),
      range: [innerHeight, 0],
      nice: true,
      clamp: true,
    })

    // Tooltip

    // Return the visual

    return (
      <svg ref={ref} width={width} height={height}>
        <g transform={`translate(${margin.left},${margin.top})`}>
          <AxisBottom
            scale={xScale}
            top={innerHeight}
            tickFormat={format("0")}
            numTicks={5}
          />
          <AxisLeft
            numTicks={5}
            scale={yScale}
            hideAxisLine
            top={-4}
            left={4}
            hideTicks
            tickLabelProps={() => ({
              fontSize: "12px",
              textAnchor: "start",
              verticalAnchor: "end",
            })}
          />
          <GridRows scale={yScale} width={innerWidth} numTicks={5} />
          <LinePath
            data={data}
            curve={curveLinear}
            x={(d) => xScale(getX(d))}
            y={(d) => yScale(getY(d))}
            defined={(d) => getY(d)}
          >
            {({ path }) => (
              <motion.path
                d={path(data)}
                strokeWidth={2}
                strokeOpacity={0.8}
                className='stroke-slate-900'
                strokeLinecap='round'
                stroke='pink'
                fill='none'
                initial='hidden'
                animate='visible'
                variants={draw}
              />
            )}
          </LinePath>
          <Threshold
            id={`${Math.random()}`}
            data={data}
            curve={curveLinear}
            x={(d) => xScale(getX(d)) ?? 0}
            y0={(d) => (yScale(getY(d)) > 0 ? yScale(0) : yScale(getY(d)))}
            y1={(d) => (yScale(getY(d)) > 0 ? yScale(getY(d)) : yScale(0))}
            clipAboveTo={innerHeight}
            clipBelowTo={0}
            defined={(d) => getY(d)}
            aboveAreaProps={{
              fill: "violet",
              fillOpacity: 0.4,
            }}
            belowAreaProps={{
              fill: "violet",
              fillOpacity: 0.4,
            }}
          />
        </g>
        <Text y={height} x={0} verticalAnchor='end' fill='white' fontSize={10}>
          Source: World Bank
        </Text>
      </svg>
    )
  }
)

export default AreaChart
