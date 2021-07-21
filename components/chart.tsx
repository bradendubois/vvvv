import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useMapContext } from "../util/map_interface";

import style from "../styles/Chart.module.scss"
import { color } from "../pages";

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

    return (<div className={`${style.container} ${style[code]}`}>

        <h4>{display}</h4>

        <hr />

        {/* Snazzy ResponsiveContainer to make width responsive */}
        <ResponsiveContainer className={code} height={250} width={350}>
            <LineChart data={context.canada[code]?.filter(x => x.date <= context.dateUpper && x.date >= context.dateLower)}>
                <Tooltip />

                <CartesianGrid strokeDasharray={"3 3"} stroke={"#ccc"}/>
                <XAxis dataKey={"date_string"} allowDuplicatedCategory={false}/>

                {/* Active Cases*/}
                <YAxis fontSize={12} yAxisId={"L"} orientation={"left"}/>
                <Line
                    yAxisId={"L"}
                    dataKey={"active_cases"}
                    stroke={color.active_cases}
                />

                {/* Vaccine Administration - Second/Final Dose */}
                <YAxis fontSize={12} yAxisId={"R"} orientation={"right"}/>
                <Line
                    yAxisId={"R"}
                    dataKey={"first_dose_cumulative"}
                    stroke={color.final_dose}
                />

                {/* Vaccine Administration - Second/Final Dose */}
                <YAxis yAxisId={"R"} orientation={"right"}/>
                <Line
                    yAxisId={"R"}
                    dataKey={"final_dose_cumulative"}
                    stroke={color.first_dose}
                />
            </LineChart>
        </ResponsiveContainer>
    </div>)
}

export default Chart