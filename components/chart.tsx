import { useEffect, useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import { ScaleLoader } from "react-spinners";

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
    data: COVIDDaily[]
}


/**
 * A Chart built with 'recharts' LineChart component to visualize COVID information
 * @constructor
 */
const Chart = ({ country, code, display, data }: ChartProps) => {

    const context = useMapContext()

    const [lastMatch, setLastMatch] = useState()

    useEffect(() => {
        
        return
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

        /*
        setCleaned(data);
        
        if (!context.match && country === Country.Canada && code == "SK") {
            context.searchMatch(Country.Canada, code, data.slice(-20)[0].date, data.slice(-20))
        }

        // callback(code, cleaned[cleaned.length-1]?.new_cases_normalized_100k_average)
        */

    }, [data])


    useEffect(() => {
        return
        /*
        if (!context.match || !data) return

        if (country === context.match.country && code === context.match.region) return
    
        if (lastMatch !== undefined && lastMatch.country === context.match.country && lastMatch.region === context.match.region && lastMatch.date === context.match.date) return

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
        
        // context.reportBest(country, code, best.date, best.result)
        // setLastMatch({
        //     country: context.match.country,
        //     region: context.match.region,
        //     date: context.match.date
        // })
        */
    }, [context.match, data])

    const threshold = useMemo(() => {

        if (!data) return style.lowerThreshold

        let x = data[data.length-1]?.new_cases_deaths_normalized_100k_average
        if (x >= context.upperThreshold) {
            return style.upperThreshold
        } else if (x >= context.lowerThreshold) {
            return style.middleThreshold
        } else {
            return style.lowerThreshold
        }
    }, [data, context.lowerThreshold, context.upperThreshold])

    return (<div className={`${style.container} ${threshold}`}>

        <h4>{display ?? code}</h4>

        <hr />

        {/* During debugging, placeholder div to improve performance */}
        {(DEBUG || !data) && <div className={style.loader} style={{ 
            height: "225px", 
            width: "325px"
        }}>
            <ScaleLoader color={'#36D7B7'} />
        </div>}

        {!DEBUG && data &&

        <LineChart height={225} width={325} className={code} data={data.filter(point => point.date >= context.dateLower && point.date <= context.dateUpper)}>
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
