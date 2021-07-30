import { useEffect, useState } from "react";
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import useSWR from "swr";

import { color } from "../pages";
import { Country } from "../util/api_codes";
import { useMapContext } from "../util/context/provider";
import { COVIDDaily } from "../util/types";

import style from "../styles/Chart.module.scss"


type ChartProps = {
    country: Country
    code: string
    display?: string
}

const dateRecreate = (data: COVIDDaily[]) => {
    data.forEach((day) => {
        day.date = new Date(day.date as unknown as string)
    })
}


/**
 * A Chart built with 'recharts' LineChart component to visualize COVID information
 * @constructor
 */
const Chart = ({ country, code, display }: ChartProps) => {

    const context = useMapContext()

    const [cleaned, setCleaned] = useState<COVIDDaily[]>([])

    const { data, error } = useSWR(`/api/${country}/${code}`)

    useEffect(() => {

        if (!data) return;

        dateRecreate(data)
        setCleaned(data);

        [].slice()
    }, [data])

    const threshold = () => {
        let x = cleaned[cleaned.length-1]?.new_cases_normalized_100k_average
        if (x > context.upperThreshold) {
            return style.upperThreshold
        } else if (x > context.lowerThreshold) {
            return style.lowerThreshold
        }
    }

    const debug = false;

    return (<div className={`${style.container} ${threshold()}`}>

        <h4>{display ?? code}</h4>

        <hr />

        {debug && <div style={{ height: "225px", width: "325px"}}/>}

        {!debug &&

        <LineChart height={225} width={325} className={code} data={cleaned.slice(cleaned.findIndex(point => point.date >= context.dateLower), cleaned.findIndex(point => point.date > context.dateUpper))}>
            <Tooltip />
            <CartesianGrid strokeDasharray={"3 3"} stroke={"#ccc"}/>

            <XAxis /* domain={["20-1-2021", "30-07-2021"]} */ fontSize={12} dataKey={"date_string"} allowDuplicatedCategory={false}/>

            {/* Active Cases*/}
            <YAxis tickCount={6} domain={[0, 25]} allowDataOverflow={true} allowDecimals={false} fontSize={12} yAxisId={"L"} orientation={"left"}/>

            {/* <Line
                yAxisId={"L"}
                dataKey={"active_cases"}
                stroke={color.active_cases}
            /> */}

            {/* <Line
                yAxisId={"L"}
                dataKey={"new_cases_normalized_100k"}
                stroke={color.active_cases}
            /> */}

            <Line
                yAxisId={"L"}
                dataKey={"new_cases_normalized_100k_average"}
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
        </LineChart>}
    </div>)
}

export default Chart
