import { NextApiRequest, NextApiResponse } from 'next'
import { COVIDDaily, OpenCOVIDDaily } from "../../../util/types";


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

        let date = new Date(parseInt(s[2]), parseInt(s[1])-1, parseInt(s[0]), 0, 0, 0, 0)

        if (current.push(x.cases/* + x.deaths*/) > 7) {
            current = current.slice(-7)
        }

        return {
            date,
            cases: x.cases,
            date_string: `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`,
            active_cases: x.active_cases,
            "Average Daily Case (Normalized)": (current.reduce((a, b) => a + b, 0) / current.length / population * 100000).toFixed(2),
            "First Dose Pop.": ((x.cumulative_avaccine -  x.cumulative_cvaccine) / population).toFixed(2),
            "Final Dose Pop.": (x.cumulative_cvaccine / population).toFixed(2),
        }
    })

    res.status(200).json(x)
}