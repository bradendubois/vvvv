import Head from "next/head";
import Link from "next/link";
import React, { useState } from "react";
// @ts-ignore TODO
import { DragDropContext, Draggable, Droppable, resetServerContext } from "react-beautiful-dnd"
import Chart from "../components/chart";
import { CountryGraph } from "../components/country";
import Filter from "../components/filter";
import { americaCodes, canadaCodes, Country } from "../util/api_codes";

import { useMapContext } from "../util/context/provider";
import style from '../styles/Home.module.scss'

resetServerContext()

export const color = {
    active_cases: "#bd3253",
    first_dose: "#2ca757",
    final_dose: "#177ba3"
}


/**
 * 'Main' app for the page; includes visualization, as well as user-selectable components
 * to filter or otherwise alter visualized data
 * @constructor
 */
const App = () => {

    return (<>

        <Head>
            <title>Vaccines Versus Variants, Visualized</title>
        </Head>

        <div className={style.container}>

            <h1>Vaccines Versus Variants, Visualized</h1>

            <hr/>

            {/* Selector for date range on data */}
            <Filter/>

            <hr/>

            {/* Basic 'legend' to indicate line values */}
            <div className={style.colors}>
                <div>
                    <div style={{backgroundColor: color.active_cases}}/>
                    <p>Daily New Cases (per 100k)</p>
                </div>

                <div>
                    <div style={{backgroundColor: color.first_dose}}/>
                    <p>First Dose</p>
                </div>

                <div>
                    <div style={{backgroundColor: color.final_dose}}/>
                    <p>Second / Final Dose</p>
                </div>
            </div>

            <ul>
                <li>Daily new cases are normalized to cases per 100,000.</li>
                <li>Daily new cases are the total number of new cases, not the <i>net change</i> which would account for recoveries.</li>
                <li>Vaccine uptake is represented as a proportion of the <i>total</i> population.</li>
            </ul>

            {/* Visualization / Graphs */}
            <main className={style.main}>
                <CountryGraph country={Country.Canada} initialOrdering={canadaCodes} />
                <CountryGraph country={Country.America} initialOrdering={americaCodes} />
            </main>

            <hr/>

            <div>
                <h2>Sources</h2>
                <ul>
                    <li>Canadian data accessed from the <a href={"https://opencovid.ca/api/"}>OpenCOVID API</a>.</li>
                    <li>Canadian dataset by the COVID-19 Open Data Working Group, available <a href={"https://opencovid.ca/work/dataset/"}>here</a>.</li>
                    <li>American data accessed from the <a href={"https://www.tylertech.com/products/socrata"}>Socrata API</a>.</li>
                    <li>American vaccination dataset available <a href={"https://data.cdc.gov/Vaccinations/COVID-19-Vaccinations-in-the-United-States-Jurisdi/unsk-b7fc"}>here</a>.</li>
                    <li>American case data available <a href={"https://data.cdc.gov/Case-Surveillance/United-States-COVID-19-Cases-and-Deaths-by-State-o/9mfq-cb36"}>here</a>.</li>
                </ul>
            </div>

            <hr/>

            <footer>
                <p>Developed by <Link href={"https://bradendubois.dev"}>Braden Dubois</Link>.</p>
                <p><Link href={"https://github.com/bradendubois/vvvv"}>Source Code here.</Link></p>
            </footer>

        </div>
    </>)
}
// export default Home
resetServerContext()

//////////////////////////////////////////////////////

export default App;
