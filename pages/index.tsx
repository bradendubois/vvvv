import {useEffect, useState} from "react"
import {LineChart, Line, YAxis, XAxis, CartesianGrid, Tooltip, Legend} from "recharts"

// @ts-ignore
// TODO
import ReactDatePicker from "react-datepicker";

import {DailyReport, MapContext, useMap} from "../util/map_interface";
import {OpenCOVID} from "../util/api_codes";

import styles from '../styles/Home.module.scss'
import "react-datepicker/dist/react-datepicker.css";


const DatePicker = ({...params}) => {

    const context = useMap()

    return (
        <ReactDatePicker
            {...params}
            todayButton={true}
        />
    )
}

const Postcard = ({ province }: { province: OpenCOVID }) => {

    const context = useMap();

    return (
        <div>
            <button onClick={() => context.setSelected(province)}>{province}</button>
        </div>
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

            <LineChart width={1000} height={400} data={context.COVIDData}>
                <Legend verticalAlign={"top"} />
                <Tooltip />

                <Line name={"Active Cases"} yAxisId={"L"} type={"monotone"} dataKey={"active_cases"} stroke={"#8884d8"}/>
                <CartesianGrid scale={1} stroke={"#ccc"}/>
                <XAxis dataKey={"date"}/>
                <YAxis yAxisId={"L"} orientation={"left"}/>

                <Line  yAxisId={"R"} type={"monotone"} dataKey={"cumulative_avaccine"}/>
                <YAxis yAxisId={"R"} orientation={"right"}/>
            </LineChart>

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
                <Postcard province={OpenCOVID.Yukon} />
                <Postcard province={OpenCOVID.NorthwestTerritories} />
                <Postcard province={OpenCOVID.Nunavut} />

                <Postcard province={OpenCOVID.BritishColumbia} />
                <Postcard province={OpenCOVID.Alberta} />
                <Postcard province={OpenCOVID.Saskatchewan} />
                <Postcard province={OpenCOVID.Manitoba} />
                <Postcard province={OpenCOVID.Ontario} />
                <Postcard province={OpenCOVID.Quebec} />
                <Postcard province={OpenCOVID.NewfoundlandLabrador} />
                <Postcard province={OpenCOVID.NewBrunswick} />
                <Postcard province={OpenCOVID.PrinceEdwardIsland} />
                <Postcard province={OpenCOVID.NovaScotia} />
            </main>
        </div>
    )
}

export default Home