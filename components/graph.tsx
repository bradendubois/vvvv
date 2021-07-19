import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// @ts-ignore
// TODO
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { useMap } from "../util/map_interface";

import style from "../styles/Graph.module.scss"

const DatePicker = ({...params}) => {

    const context = useMap()

    return (
        <ReactDatePicker
            {...params}
            todayButton={true}
        />
    )
}


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
                    />)}

                    {/* Vaccine Administration */}
                    {Array.from(context.ShowRegions).map(x => <Line
                        data={context.COVIDData.filter(y => y.province == x)}
                        yAxisId={"R"}
                        dataKey={"cumulative_avaccine"}
                    />)}
                </LineChart>
            </ResponsiveContainer>

            <div className={style.range}>
                <div>
                    <p>Range Begin</p>
                    <DatePicker minDate={context.lowerValid} maxDate={context.dateUpper ?? context.upperValid} selected={context.dateLower} onChange={(date: Date) => context.setDateLower(date)} />
                </div>

                <p>Days Between: <span>{context.COVIDData.length}</span></p>

                <div>
                    <p>Range End</p>
                    <DatePicker minDate={context.dateLower ?? context.lowerValid} maxDate={context.upperValid} selected={context.dateUpper} onChange={(date: Date) => context.setDateUpper(date)} />
                </div>
            </div>
        </div>
    )
}

export default Graph