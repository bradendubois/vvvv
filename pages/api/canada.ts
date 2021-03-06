import { NextApiRequest, NextApiResponse } from 'next'
import { OpenCOVIDDaily } from "../../util/types";
import { canadaCodes } from "../../util/api_codes";


/**
 * Sorts / cleans up data for one region (Province / Territory)
 * @param covid All covid data (vaccinations + cases) from the OpenCOVID API
 * @param population The population of the region
 */
const handleRegion = (covid: OpenCOVIDDaily[], population: number) => {

    let current: number[] = []
    let x = covid.map(x => {

        let s = x.date.split("-")

        let date = new Date(parseInt(s[2]), parseInt(s[1])-1, parseInt(s[0]), 0, 0, 0, 0)

        if (current.push(x.cases/* + x.deaths*/) > 7) {
            current = current.slice(-7)
        }

        return {
            date,
            cases: x.cases,
            date_string: `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`,
            new_cases: x.active_cases,
            "Avg. Case (Normalized)": (current.reduce((a, b) => a + b, 0) / current.length / population * 100000).toFixed(2),
            "First Dose Pop.": ((x.cumulative_avaccine -  x.cumulative_cvaccine) / population).toFixed(2),
            "Final Dose Pop.": (x.cumulative_cvaccine / population).toFixed(2),
        }
    })

    return x
}

export default async (req: NextApiRequest, res: NextApiResponse) => {

    let today = new Date()

    // COVID Case Data - Must include 'before' parameter to get 'all' the data
    let covid = await fetch(`https://api.opencovid.ca/summary?after=1-1-2020&before=${today.getDate()}-${today.getMonth()+1}-${today.getFullYear()}`)
        .then(response => response.json())
        .then(json => json.summary)

    // Population Data
    let population = await fetch(`https://api.opencovid.ca/other?stat=prov`).then(response => response.json())

    let m = Object.fromEntries(canadaCodes.map(region => {

        let c = covid.filter((x: any) => x.province === region.display)
        if (c.length === 0) {
            c = covid.filter((x: any) => x.province === region.dataset)
        }

        let p = population.prov.find((x: any) => x.province_short === region.code).pop

        return [region.code, handleRegion(c, p)]
    }))

    res.status(200).json(m)
}