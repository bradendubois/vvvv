import { useEffect, useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import useSWR from "swr";

import { color } from "../pages";
import { Country } from "../util/api_codes";
import { useMapContext } from "../util/context/provider";
import { COVIDDaily, OpenCOVIDDaily, SocrataVaccinationDaily } from "../util/types";

import style from "../styles/Chart.module.scss"


type ChartProps = {
    country: Country
    region: string
    display?: string
}

const cleanCanadaData = (covid: any, population: number) => {

    let x: COVIDDaily[] = covid.map((x: OpenCOVIDDaily) => {

        let s = x.date.split("-")

        let date = new Date()
        date.setDate(parseInt(s[0]))
        date.setMonth(parseInt(s[1])-1)
        date.setFullYear(parseInt(s[2]))
        date.setHours(0, 0, 0, 0)

        return {
            date,
            date_string: x.date,
            active_cases: x.active_cases,
            first_dose_population_cumulative: ((x.cumulative_avaccine -  x.cumulative_cvaccine) / population).toFixed(2),
            final_dose_population_cumulative: (x.cumulative_cvaccine / population).toFixed(2),
        }
    })

    return x
}


const cleanAmericaData = (vaccination: SocrataVaccinationDaily[], cases: any) => {

    let mapped = vaccination.map((x: SocrataVaccinationDaily) => {

        // The dates returned are initially a string
        let date = new Date(x.date as unknown as string)

        return {
            date,
            date_string: `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`,
            active_cases: 0,
            new_case: 0,
            new_death: 0,
            first_dose_population_cumulative: parseInt(x.administered_dose1_pop_pct) / 100,
            final_dose_population_cumulative: parseInt(x.series_complete_pop_pct) / 100,
        }
    })

    cases.forEach((day: any) => {

        let d = new Date(day.submission_date as unknown as string)
        console.log(d)
        let same = mapped.find(x => x.date_string ==`${d.getDate()}-${d.getMonth()}-${d.getFullYear()}`)
        if (same) {
            same.new_case = parseInt(day.new_case)
            same.new_death = parseInt(day.new_death)
        }
    })


    return mapped
}


/**
 * A Chart built with 'recharts' LineChart component to visualize COVID information
 * @constructor
 */
const Chart = ({ country, region, display }: ChartProps) => {

    const context = useMapContext()

    const [cleaned, setCleaned] = useState<COVIDDaily[]>([])

    const { data, error } = useSWR(`/api/${country}/${region}`)

    useEffect(() => {

        if (!data) return;

        if (country == Country.Canada) {
            setCleaned(cleanCanadaData(data.covid, data.population))
        } else if (country == Country.America) {
            // @ts-ignore
            setCleaned(cleanAmericaData(data.vaccination as SocrataVaccinationDaily[], data.cases))
        } else {
            throw new Error(`Unsupported country: ${country}`)
        }

    }, [data])


    return (<div className={`${style.container} ${style[region]}`}>

        <h4>{display ?? region}</h4>

        <hr />

        {/* Snazzy ResponsiveContainer to make width responsive */}
        <ResponsiveContainer  height={250} width={350}>
            <LineChart className={region} data={cleaned.filter((point: COVIDDaily) => point.date <= context.dateUpper && point.date >= context.dateLower)}>
                <Tooltip />

                <CartesianGrid strokeDasharray={"3 3"} stroke={"#ccc"}/>
                <XAxis fontSize={12} dataKey={"date_string"} allowDuplicatedCategory={false}/>

                {/* Active Cases*/}
                <YAxis fontSize={12} yAxisId={"L"} orientation={"left"}/>
                <Line
                    yAxisId={"L"}
                    dataKey={"active_cases"}
                    stroke={color.active_cases}
                />

                <Line
                    yAxisId={"L"}
                    dataKey={"new_death"}
                    stroke={color.active_cases}
                />

                <Line
                    yAxisId={"L"}
                    dataKey={"new_case"}
                    stroke={color.active_cases}
                />

                {/* Vaccine Administration - First Dose */}
                <YAxis fontSize={12} yAxisId={"R"} orientation={"right"} domain={[0, 1]}/>
                <Line
                    yAxisId={"R"}
                    dataKey={"first_dose_population_cumulative"}
                    stroke={color.first_dose}
                />

                {/* Vaccine Administration - Second/Final Dose */}
                <Line
                    yAxisId={"R"}
                    dataKey={"final_dose_population_cumulative"}
                    stroke={color.final_dose}
                />
            </LineChart>
        </ResponsiveContainer>
    </div>)
}

export default Chart
