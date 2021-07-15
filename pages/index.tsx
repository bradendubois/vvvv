import {useState} from "react";

import {useMap} from "../util/map_interface";
import {OpenCOVID} from "../util/api_codes";

import styles from '../styles/Home.module.css'


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

            <main className={styles.main}>
                <Postcard province={OpenCOVID.BritishColumbia} />
                <Postcard province={OpenCOVID.Alberta} />
                <Postcard province={OpenCOVID.Saskatchewan} />
                <Postcard province={OpenCOVID.Manitoba} />
                <Postcard province={OpenCOVID.Ontario} />
            </main>
        </div>
    )
}

export default Home