import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useMapContext } from "../util/map_interface";

import style from "../styles/Graph.module.scss"
import { regionCodeExpand } from "../util/api_codes";

type ChartProps = {
    region: String
}

/**
 * A Chart built with 'recharts' LineChart component to visualize COVID information
 * @constructor
 */
const Chart = ({ region }: ChartProps) => {

    const context = useMapContext()

    return (
        // Snazzy ResponsiveContainer to make width responsive
        <ResponsiveContainer height={300} width={300}>

            <LineChart>
                <Legend verticalAlign={"top"} />
                <Tooltip />

                <CartesianGrid strokeDasharray={"3 3"} stroke={"#ccc"}/>
                <XAxis dataKey={"date"} allowDuplicatedCategory={false}/>

                {/* Active Cases*/}
                <YAxis yAxisId={"L"} orientation={"left"}/>
                <Line
                    data={context.canada.filter(point => point.region == region)}
                    yAxisId={"L"}
                    dataKey={"active_cases"}
                    stroke={"#bd3253"}
                />

                {/* Vaccine Administration */}
                <YAxis yAxisId={"R"} orientation={"right"}/>
                <Line
                    data={context.canada.filter(point => point.region == region)}
                    yAxisId={"R"}
                    dataKey={"cumulative_avaccine"}
                    stroke={"#177ba3"}
                />
            </LineChart>
        </ResponsiveContainer>
    )
}

export default Chart