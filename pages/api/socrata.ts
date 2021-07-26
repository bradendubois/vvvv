import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {

    // let url = `https://data.cdc.gov/resource/8xkx-amqh.json?$where=date%20between%20%272020-01-01T00:00:00%27%20and%20%27${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}T00:00:00%27`

    let vaccination_url = `https://data.cdc.gov/resource/unsk-b7fc.json?$$app_token=${process.env.SOCRATA_TOKEN}&$limit=999999999&$order=date%20ASC`
    let vaccination = await fetch(vaccination_url).then(response => response.json())

    res.status(200).json({
        // population,
        vaccination
    })
}