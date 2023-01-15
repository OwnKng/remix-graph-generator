import { useLoaderData } from "@remix-run/react"
import ChartWrapper from "~/components/ChartWrapper"
import { fetchWorldBankData } from "~/util"

export async function loader({ params }) {
  const { indicator, country } = params

  const data = await fetchWorldBankData(country, indicator)

  return {
    data,
    indicator: data[0].indicator,
  }
}

export default function Viz() {
  const { data, indicator } = useLoaderData()

  return (
    <div>
      {data ? (
        <ChartWrapper data={data} x='date' y='value' />
      ) : (
        <p>Nothing to seee here</p>
      )}
    </div>
  )
}
