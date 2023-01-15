import { countries } from "data/countries"
import { indicators } from "data/indicators"

export const getIndicators = () => indicators.map((i) => i.indicator)

export const getCountries = () => countries.map((c) => c.name)

export const getIsoCodes = (countryName: string) =>
  countries.find((c) => c.name === countryName)?.code

export const getIndicatorCode = (indicatorName: string) =>
  indicators.find((i) => i.indicator === indicatorName)?.indicator_id

const getNumberOfPages = async (url: string) =>
  await fetch(url)
    .then((response) => response.json())
    .then((data) => data[0].pages)
    .catch((error) => console.log(error))

const getData = async (url: string) =>
  await fetch(url)
    .then((resp) => resp.json())
    .then((json) => json[1])
    .then((data) =>
      data.map((d: any) => ({
        date: Number(d.date),
        country: d.country.value,
        indicator: d.indicator.value,
        value: d.value,
      }))
    )
    .catch((e) => {
      throw new Error(e)
    })

export const fetchWorldBankData = async (
  countryCodes: string,
  indicator: string
): Promise<any[]> => {
  const url = `https://api.worldbank.org/v2/country/${countryCodes}/indicator/${indicator}?format=json&per_page=50`

  const numberOfPages = await getNumberOfPages(url)

  const urls = Array.from(
    { length: numberOfPages },
    (_, i) => `${url}&page=${i + 1}`
  )

  return Promise.all(urls.map(async (url) => await getData(url))).then((data) =>
    data.reduce((acc, cur) => acc.concat(cur), [])
  )
}
