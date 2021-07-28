import { NextApiRequest, NextApiResponse } from 'next'
import { SocrataVaccinationDaily } from "../../../util/types";

export default async (req: NextApiRequest, res: NextApiResponse) => {

    let { region } = req.query;

    let case_url = `https://data.cdc.gov/resource/9mfq-cb36.json?$$app_token=${process.env.SOCRATA_TOKEN}&$limit=999999999&$order=submission_date&$select=submission_date,state,new_case,pnew_case,new_death,pnew_death&state=${region}`
    let cases = await fetch(case_url).then(response => response.json())

    let vaccination_url = `https://data.cdc.gov/resource/unsk-b7fc.json?$$app_token=${process.env.SOCRATA_TOKEN}&$limit=999999999&$order=date%20ASC&$select=date,administered_dose1_recip,administered_dose1_pop_pct,series_complete_yes,series_complete_pop_pct&location=${region}`
    let vaccination = await fetch(vaccination_url).then(response => response.json())

    let current: number[] = []
    let mapped = vaccination.map((x: SocrataVaccinationDaily) => {

        // The dates returned are initially a string
        let date = new Date(x.date as unknown as string)

        return {
            date,
            date_string: `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`,
            active_cases: 0,
            new_case: -1,
            new_death: 0,
            new_cases_normalized_100k_average: -1,
            population: parseInt(x.administered_dose1_recip) / (parseInt(x.administered_dose1_pop_pct) / 100),
            first_dose_population_cumulative: parseInt(x.administered_dose1_pop_pct) / 100,
            final_dose_population_cumulative: parseInt(x.series_complete_pop_pct) / 100,
        }
    })

    cases.forEach((day: any) => {

        let d = new Date(day.submission_date as unknown as string)

        let same = mapped.find((x: any) => x.date_string ==`${d.getDate()}-${d.getMonth()}-${d.getFullYear()}`)
        if (same) {
            same.new_case = parseInt(day.new_case)
            same.new_death = parseInt(day.new_death)
        }
    })

    mapped.forEach((day: any) => {

        if (day.new_case !== -1 && current.push(day.new_case) > 7) {
            current = current.splice(-7)
        }

        day.new_cases_normalized_100k_average = current.reduce((a, b) => a + b, 0) / current.length / day.population * 100000

    })

    res.status(200).json(mapped)
}