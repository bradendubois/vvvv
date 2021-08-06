import { useEffect, useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import useSWR from "swr";

import { color } from "../pages";
import { Country } from "../util/api_codes";
import { useMapContext } from "../util/context/provider";
import { COVIDDaily } from "../util/types";

import style from "../styles/Chart.module.scss"

const DEBUG = false

type ChartProps = {
    country: Country
    code: string
    display?: string
    callback(region: string, value: number): void
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
const Chart = ({ country, code, display, callback }: ChartProps) => {

    const context = useMapContext()

    const [cleaned, setCleaned] = useState<COVIDDaily[]>([])
    const [mount, setMount] = useState(false)

    const { data, error } = useSWR(mount ? `/api/${country}/${code}` : null)

    // const [saved, setSaved] = useState(false)

    useEffect(() => setMount(true), [])

    useEffect(() => {

        if (!data) return;

        /*
        if (!saved) {

            const fileData = JSON.stringify(data)
            const blob = new Blob([fileData], {type: "text/plain"});
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = `${country}-${code}.json`;
            link.href = url;
            link.click();
            
            setSaved(true)
        }
        */

        dateRecreate(data)
        setCleaned(data);
        

        // callback(code, cleaned[cleaned.length-1]?.new_cases_normalized_100k_average)

    }, [data])

    const threshold = useMemo(() => {
        let x = cleaned[cleaned.length-1]?.new_cases_deaths_normalized_100k_average
        if (x >= context.upperThreshold) {
            return style.upperThreshold
        } else if (x >= context.lowerThreshold) {
            return style.middleThreshold
        } else {
            return style.lowerThreshold
        }
    }, [cleaned])

    const filteredPoints = useMemo(() => {
        return cleaned.filter(point => point.date >= context.dateLower && point.date <= context.dateUpper)
    }, [context.dateLower, context.dateUpper, cleaned])

    return (<div className={`${style.container} ${threshold}`}>

        <h4>{display ?? code}</h4>

        <hr />

        {/* During debugging, placeholder div to improve performance */}
        {DEBUG && <div style={{ height: "225px", width: "325px"}}/>}

        {!DEBUG &&

        <LineChart height={225} width={325} className={code} data={filteredPoints}>
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
                dataKey={"new_cases_deaths_normalized_100k_average"}
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
