import { NextApiRequest, NextApiResponse } from 'next'
import { SocrataCaseDaily, SocrataVaccinationDaily } from "../../util/types";
import { americaCodes } from "../../util/api_codes";


const handleRegion = (cases: SocrataCaseDaily[], vaccination: SocrataVaccinationDaily[]) => {

    let population = parseInt(vaccination[vaccination.length-1].administered_dose1_recip) / (parseInt(vaccination[vaccination.length-1].administered_dose1_pop_pct) / 100)

    let current: number[] = []
    let mapped = vaccination.map(x => {

        // The dates returned are initially a string
        let date = new Date(x.date as unknown as string)

        return {
            date,
            date_string: `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`,
            // active_cases: 0,
            new_case: -1,
            // new_death: -1,
            "Daily New Cases (Normalized-100k)": -1,
            "First Dose Pop.": parseInt(x.administered_dose1_pop_pct) / 100,
            "Final Dose Pop.": parseInt(x.series_complete_pop_pct) / 100,
        }
    })

    cases.forEach(day => {
        let d = new Date(day.submission_date as unknown as string)
        let same = mapped.find((x: any) => x.date_string ==`${d.getDate()}-${d.getMonth()+1}-${d.getFullYear()}`)
        if (same) {
            same.new_case = parseInt(day.new_case)
            // same.new_death = parseInt(day.new_death)
        }
    })

    mapped.forEach((day: any) => {

        let total = 0

        if (day.new_case !== -1) { total += day.new_case }
        // if (day.new_death === -1) { total += day.new_death}

        if (day.new_case !== -1 /*&& day.new_death !== -1*/ && current.push(total) > 7) {
            current = current.slice(-7)
        }

        day["Average Daily Case (Normalized)"] = (current.reduce((a, b) => a + b, 0) / current.length / population * 100000).toFixed(2)

    })

    return mapped
}

export default async (req: NextApiRequest, res: NextApiResponse) => {

    let { region } = req.query;

    let case_url = `https://data.cdc.gov/resource/9mfq-cb36.json?$$app_token=${process.env.SOCRATA_TOKEN}&$limit=999999999&$order=submission_date&$select=submission_date,state,new_case,pnew_case,new_death,pnew_death`
    let cases: SocrataCaseDaily[] = await fetch(case_url).then(response => response.json())

    let vaccination_url = `https://data.cdc.gov/resource/unsk-b7fc.json?$$app_token=${process.env.SOCRATA_TOKEN}&$limit=999999999&$order=date%20ASC&$select=location,date,administered_dose1_recip,administered_dose1_pop_pct,series_complete_yes,series_complete_pop_pct`
    let vaccination: SocrataVaccinationDaily[] = await fetch(vaccination_url).then(response => response.json())

    let m = Object.fromEntries(americaCodes.map(region => {

        let c = cases.filter(x => x.state === region.code)
        let v = vaccination.filter(x => x.location === region.code)

        return [region.code, handleRegion(c, v)]
    }))

    res.status(200).json(m)
}