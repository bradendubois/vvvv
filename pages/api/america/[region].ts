import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {

    // let case_url = 'https://data.cdc.gov/Case-Surveillance/United-States-COVID-19-Cases-and-Deaths-by-State-o/9mfq-cb36/data'

    let { region } = req.query;

    // let case_url = `https://data.cdc.gov/resource/9mfq-cb36.json?$$app_token=${process.env.SOCRATA_TOKEN}&$limit=999999999&$order=submission_date&$select=state,tot_cases`

    let vaccination_url = `https://data.cdc.gov/resource/unsk-b7fc.json?$$app_token=${process.env.SOCRATA_TOKEN}&$limit=999999999&$order=date%20ASC&$select=date,location,administered_dose1_recip,series_complete_yes,administered_dose1_pop_pct,series_complete_pop_pct&location=${region}`
    let vaccination = await fetch(vaccination_url).then(response => response.json())

    res.status(200).json({
        vaccination
    })
}