/* eslint-disable react/display-name */
import { scaleLinear, scaleOrdinal } from "@visx/scale"
import { cumsum, extent, group } from "d3-array"
import { AxisBottom, AxisLeft } from "@visx/axis"
import { LinePath } from "@visx/shape"
import { curveLinear } from "@visx/curve"
import { forwardRef } from "react"
import { format } from "d3-format"
import { GridRows } from "@visx/grid"
import { motion } from "framer-motion"
import { getStringWidth, Text } from "@visx/text"

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
  top: 50,
  left: 15,
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

const LineChart = forwardRef(
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
    const getColor = (d: any) => d[color]

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

    const keys = [...new Set(data.map((d) => getColor(d)))]
    const colorScale = scaleOrdinal({
      domain: keys,
      range: ["#09bc8a", "#E86A92", "#C6DBF0", "#ECBA82", "#1098F7"],
    })

    // Line generator
    const dataGrouped = group(data, (d) => d.country)

    // Tooltip

    if (width < 50) return null

    //* legend
    const cumSum = (
      (sum) => (value) =>
        (sum += value)
    )(0)

    const widths = keys.map((key) => 25 + getStringWidth(key))
    const offsets = widths.map((width, i, arr) =>
      Math.round(cumSum(width) - arr[i])
    )

    return (
      <svg ref={ref} width={width} height={height}>
        <rect x={0} y={0} width={width} height={height} fill='#12182b' />
        <g transform={`translate(${margin.left},${margin.top})`}>
          <GridRows
            scale={yScale}
            width={innerWidth}
            numTicks={5}
            stroke='#30374e'
          />
          <AxisBottom
            scale={xScale}
            top={innerHeight}
            tickFormat={format("0")}
            numTicks={5}
            tickStroke='white'
            stroke='white'
            tickLabelProps={() => ({
              fontSize: "10px",
              textAnchor: "middle",
              verticalAnchor: "end",
              fill: "white",
              fontFamily: "ui-sans-serif",
            })}
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
              fill: "white",
              fontFamily: "ui-sans-serif",
            })}
          />

          {keys.map((key) => (
            <LinePath
              key={`line-${key}`}
              curve={curveLinear}
              x={(d) => xScale(getX(d))}
              y={(d) => yScale(getY(d))}
              defined={(d) => getY(d)}
            >
              {({ path }) => (
                <motion.path
                  d={path(dataGrouped.get(key) || "")}
                  strokeWidth={2}
                  strokeOpacity={0.8}
                  stroke={colorScale(key)}
                  strokeLinecap='round'
                  fill='none'
                  initial='hidden'
                  animate='visible'
                  variants={draw}
                />
              )}
            </LinePath>
          ))}
        </g>
        <g>
          {keys.map((key, i) => (
            <g key={key} transform={`translate(${offsets[i]},0)`}>
              <rect x={0} width={20} y={0} height={20} fill={colorScale(key)} />
              <Text
                x={25}
                y={10}
                verticalAnchor='middle'
                fontSize={12}
                fill='white'
              >
                {key}
              </Text>
            </g>
          ))}
        </g>
        <Text y={height} x={0} verticalAnchor='end' fill='white' fontSize={10}>
          Source: World Bank
        </Text>
      </svg>
    )
  }
)

export default LineChart
