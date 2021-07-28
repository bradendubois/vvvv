import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {

    let { region } = req.query;

    let case_url = `https://data.cdc.gov/resource/9mfq-cb36.json?$$app_token=${process.env.SOCRATA_TOKEN}&$limit=999999999&$order=submission_date&$select=submission_date,state,new_case,pnew_case,new_death,pnew_death&state=${region}`
    let cases = await fetch(case_url).then(response => response.json())

    let vaccination_url = `https://data.cdc.gov/resource/unsk-b7fc.json?$$app_token=${process.env.SOCRATA_TOKEN}&$limit=999999999&$order=date%20ASC&$select=date,administered_dose1_recip,administered_dose1_pop_pct,series_complete_yes,series_complete_pop_pct&location=${region}`
    let vaccination = await fetch(vaccination_url).then(response => response.json())

    console.log(cases)
    res.status(200).json({
        cases,
        vaccination
    })
}