import { useEffect, useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import useSWR from "swr";

import { color } from "../pages";
import { Country } from "../util/api_codes";
import { useMapContext } from "../util/context/provider";
import { COVIDDaily } from "../util/types";

import style from "../styles/Chart.module.scss"
import { DEBUG } from "../pages/_app";

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
        
        if (country === Country.Canada && code == "SK") {
            context.searchMatch(Country.Canada, code, data.slice(-20))
        }

        // callback(code, cleaned[cleaned.length-1]?.new_cases_normalized_100k_average)

    }, [data])




    const rmse = (source: COVIDDaily[], target: COVIDDaily[]) => {

        if (source.length !== target.length) {
            throw new Error("Non-matching lengths across given parameters")
        }
    
        let total = 0
    
        source.forEach((point, index) => {
            
            let a = point.new_cases_deaths_normalized_100k_average
            let b = target[index].new_cases_deaths_normalized_100k_average
    
            if (a !== undefined && b !== undefined) {
                total += (a - b) ** 2
            } else {
                return -1
            }
        })
    
        return Math.sqrt(total)
    }
    

    useEffect(() => {

        if (!context.match || !data) return

        if (country === context.match.country && code === context.match.region) return

        let target = context.match.points
        let range = target.length

        let i = 0
        let best

        while (true) {

            let dataSlice = data.slice(i, i+range)

            if (dataSlice.length < range) {
                break
            }

            let result = rmse(target, dataSlice)

            if (result !== -1 && (!best || result < best.result)) {
                best = {
                    date: dataSlice[0].date,
                    result
                }
            }

            i += 1
        }

        console.log(country, code, best.date, best.result)

    }, [context.match, data])

    const threshold = useMemo(() => {
        let x = cleaned[cleaned.length-1]?.new_cases_deaths_normalized_100k_average
        if (x >= context.upperThreshold) {
            return style.upperThreshold
        } else if (x >= context.lowerThreshold) {
            return style.middleThreshold
        } else {
            return style.lowerThreshold
        }
    }, [cleaned, context.lowerThreshold, context.upperThreshold])

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

            <XAxis fontSize={12} dataKey={"date_string"} allowDuplicatedCategory={false}/>

            {/* Active Cases*/}
            <YAxis tickCount={6} domain={[0, 25]} allowDataOverflow={true} allowDecimals={false} fontSize={12} yAxisId={"L"} orientation={"left"}/>

            {/* Daily New Cases+Deaths / 7 Day Average, Normalized to 100k */}
            <Line
                isAnimationActive={false}
                yAxisId={"L"}
                dataKey={"new_cases_deaths_normalized_100k_average"}
                stroke={color.active_cases}
            />


            {/* Vaccine Administration - First Dose */}
            <YAxis fontSize={12} yAxisId={"R"} orientation={"right"} domain={[0, 1]}/>
            <Line
                isAnimationActive={false}
                yAxisId={"R"}
                dataKey={"first_dose_population_cumulative"}
                stroke={color.first_dose}
            />

            {/* Vaccine Administration - Second/Final Dose */}
            <Line
                isAnimationActive={false}
                yAxisId={"R"}
                dataKey={"final_dose_population_cumulative"}
                stroke={color.final_dose}
            />
        </LineChart>}
    </div>)
}

export default Chart
