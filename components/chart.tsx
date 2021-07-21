import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useMapContext } from "../util/map_interface";

import style from "../styles/Chart.module.scss"

type ChartProps = {
    code: string
    display?: string
}

/**
 * A Chart built with 'recharts' LineChart component to visualize COVID information
 * @constructor
 */
const Chart = ({ display, code }: ChartProps) => {

    const context = useMapContext()

    return (<div className={style[code]}>

        <h4>{display}</h4>

        {/* Snazzy ResponsiveContainer to make width responsive */}
        <ResponsiveContainer className={code} height={300} width={350}>
            <LineChart data={context.canada[code]?.filter(x => x.date <= context.dateUpper && x.date >= context.dateLower)}>
                <Legend verticalAlign={"top"} />
                <Tooltip />

                <CartesianGrid strokeDasharray={"3 3"} stroke={"#ccc"}/>
                <XAxis dataKey={"date_string"} allowDuplicatedCategory={false}/>

                {/* Active Cases*/}
                <YAxis fontSize={12} yAxisId={"L"} orientation={"left"}/>
                <Line
                    yAxisId={"L"}
                    dataKey={"active_cases"}
                    stroke={"#bd3253"}
                />

                {/* Vaccine Administration - Second/Final Dose */}
                <YAxis fontSize={12} yAxisId={"R"} orientation={"right"}/>
                <Line
                    yAxisId={"R"}
                    dataKey={"first_dose_cumulative"}
                    stroke={"#177ba3"}
                />

                {/* Vaccine Administration - Second/Final Dose */}
                <YAxis yAxisId={"R"} orientation={"right"}/>
                <Line
                    yAxisId={"R"}
                    dataKey={"final_dose_cumulative"}
                    stroke={"#2ca757"}
                />
            </LineChart>
        </ResponsiveContainer>
    </div>)
}

export default Chart