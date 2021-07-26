import { NextApiRequest, NextApiResponse } from 'next'

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

    res.status(200).json({
        covid,
        population
    })
}