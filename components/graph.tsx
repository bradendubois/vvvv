import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { useMap } from "../util/map_interface";

import style from "../styles/Graph.module.scss"


const Graph = () => {

    const context = useMap()

    return (
        <div className={style.container}>
            <ResponsiveContainer height={500}>
                <LineChart>
                    <Legend verticalAlign={"top"} />
                    <Tooltip />

                    <CartesianGrid strokeDasharray={"3 3"} stroke={"#ccc"}/>
                    <XAxis dataKey={"date"} allowDuplicatedCategory={false}/>

                    <YAxis yAxisId={"L"} orientation={"left"}/>
                    <YAxis yAxisId={"R"} orientation={"right"}/>

                    {/* Active Cases*/}
                    {Array.from(context.ShowRegions).map(x => <Line
                        data={context.COVIDData.filter(y => y.province == x)}
                        yAxisId={"L"}
                        dataKey={"active_cases"}
                        stroke={"#bd3253"}
                    />)}

                    {/* Vaccine Administration */}
                    {Array.from(context.ShowRegions).map(x => <Line
                        data={context.COVIDData.filter(y => y.province == x)}
                        yAxisId={"R"}
                        dataKey={"cumulative_avaccine"}
                        stroke={"#177ba3"}
                    />)}
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

export default Graph