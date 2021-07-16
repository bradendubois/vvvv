import {Fragment, useEffect, useState} from "react"
import {LineChart, Line, YAxis, XAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts"

// @ts-ignore
// TODO
import ReactDatePicker from "react-datepicker";

import {DailyReport, MapContext, useMap} from "../util/map_interface";
import {CanadaRegions} from "../util/api_codes";

import styles from '../styles/Home.module.scss'
import "react-datepicker/dist/react-datepicker.css";
import CanadaMap from "../components/canadaMap";


const DatePicker = ({...params}) => {

    const context = useMap()

    return (
        <ReactDatePicker
            {...params}
            todayButton={true}
        />
    )
}

const Home = () => {

    const context = useMap()

    return (

        <div className={styles.container}>

            <p>{context.selected ?? "None Yet"}</p>

            <p>{context.COVIDData.length}</p>

            <DatePicker minDate={context.lowerValid} maxDate={context.dateUpper ?? context.upperValid} selected={context.dateLower} onChange={(date: Date) => context.setDateLower(date)} />
            <DatePicker minDate={context.dateLower ?? context.lowerValid} maxDate={context.upperValid} selected={context.dateUpper} onChange={(date: Date) => context.setDateUpper(date)} />

            <ResponsiveContainer>
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

            {/*
            <LineChart width={1000} height={400} data={context.COVIDData}>
                <CartesianGrid stroke={"#ccc"}/>
                <XAxis dataKey={"date"}/>
                <YAxis />
                <Tooltip />
            </LineChart>
*/}
            {/* Picker of Canadian regions */}
            <main className={styles.main}>

                <CanadaMap />

            </main>
        </div>
    )
}

export default Home