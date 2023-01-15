import { Link, Outlet } from "@remix-run/react"
import { useState } from "react"
import Autocomplete from "~/components/Autocomplete"
import {
  getIsoCodes,
  getIndicators,
  getCountries,
  getIndicatorCode,
} from "~/util"

export default function Query() {
  const [country, setCountry] = useState("United Kingdom")
  const [indicator, setIndicator] = useState("GDP Per Capita")

  return (
    <div>
      <h1 className='text-3xl font-bold underline'>Select something</h1>
      <div className='flex w-full justify-center py-8'>
        <div className='w-full flex flex-col gap-4 max-w-[720px] px-4 py-4 border border-slate-100 rounded'>
          <Autocomplete
            options={getIndicators()}
            label='Select indicator'
            onChange={(val) => setIndicator(val)}
          />
          <Autocomplete
            options={getCountries()}
            label='Select country'
            onChange={(val) => setCountry(val)}
          />
          <Link
            to={`/viz/${getIndicatorCode(indicator)}/${getIsoCodes(country)}`}
          >
            Go
          </Link>
        </div>
      </div>
      <Outlet />
    </div>
  )
}
