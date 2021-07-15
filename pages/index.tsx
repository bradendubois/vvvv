import {useState} from "react";

// @ts-ignore
// TODO
import DatePicker from "react-datepicker";

import {useMap} from "../util/map_interface";
import {OpenCOVID} from "../util/api_codes";

import styles from '../styles/Home.module.css'
import "react-datepicker/dist/react-datepicker.css";


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

            <DatePicker minDate={context.lowerValid} maxDate={context.dateUpper ?? context.upperValid} selected={context.dateLower} onChange={(date: Date) => context.setDateLower(date)} />
            <DatePicker minDate={context.dateLower ?? context.lowerValid} selected={context.dateUpper} onChange={(date: Date) => context.setDateUpper(date)} />

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