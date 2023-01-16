import { Link } from "@remix-run/react"
import { useState } from "react"
import Autocomplete from "~/components/Autocomplete"
import Multiselection from "~/components/Multiselection"
import {
  getIsoCodes,
  getIndicators,
  getCountries,
  getIndicatorCode,
} from "~/util"

export default function Select() {
  const [country, setCountry] = useState("")
  const [indicator, setIndicator] = useState("GDP per capita (current US$)")

  return (
    <div>
      <div className='w-full'>
        <h2 className='text-gray-100 text-lg font-bold uppercase'>
          Search for an indicator
        </h2>
      </div>
      <div className='w-full flex flex-col gap-4  px-4 py-4 border border-slate-600 rounded'>
        <Autocomplete
          options={getIndicators()}
          label='Select indicator'
          onChange={(val) => setIndicator(val)}
          initialValue='GDP per capita (current US$)'
        />
        <Multiselection
          options={getCountries()}
          onChange={(items) =>
            setCountry(items.map((item) => getIsoCodes(item)).join(";"))
          }
          initialValue={["United Kingdom"]}
        />
        {indicator && country ? (
          <Link
            className='bg-emerald-500 px-4 py-2 min-w-12 w-fit shadow-sm rounded text-slate-200'
            to={`/${getIndicatorCode(indicator)}/${country}`}
          >
            Go
          </Link>
        ) : (
          <span className='bg-slate-400 px-4 py-2 min-w-12 w-fit shadow-sm rounded text-slate-200'>
            Go
          </span>
        )}
      </div>
    </div>
  )
}
