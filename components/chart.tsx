import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useMapContext } from "../util/map_interface";

import style from "../styles/Graph.module.scss"


/**
 * A Chart built with 'recharts' LineChart component to visualize COVID information
 * @constructor
 */
const Chart = () => {

    const context = useMapContext()

    return (
        <div className={style.container}>

            {/* Snazzy ResponsiveContainer to make width responsive */}
            <ResponsiveContainer height={500}>

                <LineChart>
                    <Legend verticalAlign={"top"} />
                    <Tooltip />

                    <CartesianGrid strokeDasharray={"3 3"} stroke={"#ccc"}/>
                    <XAxis dataKey={"date"} allowDuplicatedCategory={false}/>

                    {/* Active Cases*/}
                    <YAxis yAxisId={"L"} orientation={"left"}/>
                    {Array.from(context.ShowRegions).map(x => <Line
                        data={context.canada.filter(y => y.region == x)}
                        yAxisId={"L"}
                        dataKey={"active_cases"}
                        stroke={"#bd3253"}
                    />)}

                    {/* Vaccine Administration */}
                    <YAxis yAxisId={"R"} orientation={"right"}/>
                    {Array.from(context.ShowRegions).map(x => <Line
                        data={context.canada.filter(y => y.region == x)}
                        yAxisId={"R"}
                        dataKey={"cumulative_avaccine"}
                        stroke={"#177ba3"}
                    />)}
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

export default Chart