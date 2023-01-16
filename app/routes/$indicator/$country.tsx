import { useLoaderData } from "@remix-run/react"
import ChartWrapper from "~/components/ChartWrapper"
import { fetchWorldBankData } from "~/util"

export async function loader({ params }) {
  const { indicator, country } = params

  const data = await fetchWorldBankData(country, indicator)

  return {
    data: data,
    indicator: data[0].indicator,
  }
}

export default function Viz() {
  const { data, indicator } = useLoaderData()

  return (
    <div className='w-full'>
      {data ? (
        <ChartWrapper
          data={data}
          indicator={indicator}
          x='date'
          y='value'
          color='country'
        />
      ) : null}
    </div>
  )
}

export function ErrorBoundary({ error }) {
  console.error(error)
  return (
    <html>
      <head>
        <title>Oh no!</title>
      </head>
      <body>
        <div className='w-full flex place-center justify-center  max-w-[720px]'>
          <p>
            We were unable to fetch the requested data. Please try again or
            select another indicator or country.
          </p>
        </div>
      </body>
    </html>
  )
}
