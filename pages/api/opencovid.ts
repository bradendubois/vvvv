import { NextApiRequest, NextApiResponse } from 'next'

type Population = {
    pop: number,
    province: string,
    province_full: string,
    province_short: string
}

export default async (req: NextApiRequest, res: NextApiResponse) => {

    let today = new Date()

    let data = {
        covid: {},
        population: {}
    }

    await fetch(`https://api.opencovid.ca/summary?after=1-1-2020&before=${today.getDate()}-${today.getMonth()+1}-${today.getFullYear()}`)
        .then(response => response.json())
        .then(json => data.covid = json.summary)

    await fetch(`https://api.opencovid.ca/other?stat=prov`)
        .then(response => response.json())
        .then(json => json.prov.map((p: Population) => [p.province_short, p.pop]))
        .then(parsed => data.population = Object.fromEntries(parsed))

    res.status(200).json(data)
}