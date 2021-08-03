import { NextApiRequest, NextApiResponse } from 'next'
import { COVIDDaily, OpenCOVIDDaily } from "../../../util/types";

type Population = {
    pop: number,
    province: string,
    province_full: string,
    province_short: string
}

export default async (req: NextApiRequest, res: NextApiResponse) => {

    let today = new Date()

    let { region } = req.query;

    // COVID Case Data
    let covid = await fetch(`https://api.opencovid.ca/summary?loc=${region}&after=1-1-2020&before=${today.getDate()}-${today.getMonth()+1}-${today.getFullYear()}`)
        .then(response => response.json())
        .then(json => json.summary)

    // Population Data
    let population = await fetch(`https://api.opencovid.ca/other?stat=prov`)
        .then(response => response.json())
        .then(json => json.prov.find((x: any) => x.province_short === region).pop)

    let current: number[] = []
    let x: COVIDDaily[] = covid.map((x: OpenCOVIDDaily, i: number) => {

        let s = x.date.split("-")

        let date = new Date()
        date.setDate(parseInt(s[0]))
        date.setMonth(parseInt(s[1])-1)
        date.setFullYear(parseInt(s[2]))
        date.setHours(0, 0, 0, 0)

        if (current.push(x.cases + x.deaths) > 7) {
            current = current.slice(-7)
        }

        return {
            date,
            cases: x.cases,
            date_string: x.date,
            active_cases: x.active_cases,
            new_cases_deaths_normalized_100k_average: current.reduce((a, b) => a + b, 0) / current.length / population * 100000,
            first_dose_population_cumulative: ((x.cumulative_avaccine -  x.cumulative_cvaccine) / population).toFixed(2),
            final_dose_population_cumulative: (x.cumulative_cvaccine / population).toFixed(2),
        }
    })

    res.status(200).json(x)
}