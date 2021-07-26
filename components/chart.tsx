import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { RegionEntry, useMapContext } from "../util/context/provider";

import style from "../styles/Chart.module.scss"
import { color } from "../pages";
import { COVIDDaily, OpenCOVIDDaily, SocrataVaccinationDaily } from "../util/types";
import { useEffect, useState } from "react";
import { americaCodes, americaRegions, canadaCodes, Country } from "../util/api_codes";
import useSWR from "swr";

type ChartProps = {
    country: Country
    region: string
    display?: string
}

const cleanCanadaData = (covid: any, population: any) => {

    let x: COVIDDaily[] = covid.map((x: OpenCOVIDDaily) => {

        let s = x.date.split("-")

        let date = new Date()
        date.setDate(parseInt(s[0]))
        date.setMonth(parseInt(s[1])-1)
        date.setFullYear(parseInt(s[2]))
        date.setHours(0, 0, 0, 0)

        let code = canadaCodes[x.province as string].code
        let display = canadaCodes[x.province as string].display

        // @ts-ignore
        let population: number = population[code]

        return {
            country: Country.Canada,
            region: code,
            display: display ?? x.province,
            date,
            date_string: x.date,
            active_cases: x.active_cases,
            cases: x.cases,
            cases_cumulative: x.cumulative_cases,

            first_dose: x.avaccine - x.cvaccine,
            first_dose_cumulative: x.cumulative_avaccine -  x.cumulative_cvaccine,

            final_dose: x.cvaccine,
            final_dose_cumulative: x.cumulative_cvaccine,

            first_dose_population: (x.avaccine - x.cvaccine) / population,
            first_dose_population_cumulative: (x.cumulative_avaccine -  x.cumulative_cvaccine) / population,

            final_dose_population: x.cvaccine / population,
            final_dose_population_cumulative: x.cumulative_cvaccine / population,

        }
    })

    return x
}


const cleanAmericaData = (vaccination: SocrataVaccinationDaily[]) => {

    let mapped = vaccination.map((x: SocrataVaccinationDaily) => {

        // The dates returned are initially a string
        let date = new Date(x.date as unknown as string)

        return {
            region: "",
            display: "",
            date,
            date_string: x.date,
            active_cases: 0,
            cases: 0,
            cases_cumulative: 0,

            first_dose: 0,
            first_dose_cumulative: parseInt(x.administered_dose1_recip),

            final_dose: 0,
            final_dose_cumulative: parseInt(x.series_complete_yes),

            first_dose_population: 0,
            first_dose_population_cumulative: parseInt(x.administered_dose1_pop_pct),

            final_dose_population: 0,
            final_dose_population_cumulative: parseInt(x.series_complete_pop_pct),

        }
    })
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
            setCleaned(cleanCanadaData(data))
        } else if (country == Country.America) {
            setCleaned(cleanAmericaData(data))
        } else {
            throw new Error(`Unsupported country: ${country}`)
        }

    }, [data])


    return (<div className={`${style.container} ${style[region]}`}>

        <h4>{display ?? region}</h4>

        <hr />

        {/* Snazzy ResponsiveContainer to make width responsive */}
        <ResponsiveContainer className={region} height={250} width={350}>
            <LineChart data={data?.filter(x => x.date <= context.dateUpper && x.date >= context.dateLower)}>
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
