import React from "react";
import Head from "next/head";
import Link from "next/link";

// @ts-ignore TODO
import { resetServerContext } from "react-beautiful-dnd"

import { CountryGraph } from "../components/country";
import Filter from "../components/filter";
import Legend from "../components/legend";

import { americaCodes, canadaCodes, Country } from "../util/api_codes";

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
            <title>Visualizing Variants versus Vaccines</title>
        </Head>

        {(process.env.BUILD === "PRODUCTION") && <div className={style.development}>
            <p>This is a <strong>development</strong> build! Stability, performance, feature availability, and correctness are not guaranteed!</p>
            <p>Click <Link href={"https://vvvv-main.vercel.app"}>here</Link> to go to the latest production build.</p>
        </div>}

        <div className={style.container}>

            <h1>Visualizing Variants versus Vaccines</h1>

            <hr/>

            {/* Selector for date range on data */}
            <Filter/>

            <hr/>

            {/* Basic 'legend' to indicate line values */}
            <div className={style.notes}>

                {/* Legend with example Graph */}
                <Legend />

                <hr />

                {/* Notes on the graphs */}
                <div className={style.passage}>
                    <h3>Notes on the graphs</h3>
                    <p>The graphs present snapshot comparisons of total vaccinations and daily new cases (7 day rolling average to eliminate vacillations) over time by region in the US and Canada (states, provinces, territories).</p>
                    <p>Both numbers are presented as proportions (percentages of population for vaccinations, and cases/100,000). The green line indicates percentage of persons with first doses, the blue line percentage of persons completely vaccinated (right hand y labels), and the red line shows daily cases (left hand y labels).</p>
                    <p>Additionally, graphs are tinted according to case thresholds. A white background indicates fewer than 9 daily cases/100,000, the lighter shade of red indicates between 9 and 18 cases/100,000 per day, and the darkest red indicates more than 18 cases/100,000 per day. It is possible to edit the start and end dates for the display and to change these thresholds.</p>
                    <p>Because some jurisdictions have stopped daily reporting, this visualization has been developed on the fly for those interested in continuously monitoring these numbers, which are presented without editorial comment. The 60+ graphs may take some time to draw and the response time is slow in the edit boxes. The website will be tweaked to improve performance and presentation.</p>
                </div>
            </div>

            {/* Visualization / Graphs */}
            <main className={style.main}>
                <CountryGraph country={Country.Canada} initialOrdering={canadaCodes} />
                <CountryGraph country={Country.America} initialOrdering={americaCodes} />
            </main>

            {/* 'Scroll to Top' Button */}
            <button onClick={() => {
                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            }}>Back to Top</button>

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
                <p>Developed by <Link href={"mailto:emn075@usask.ca"}>Dr. Eric Neufeld</Link> and <Link href={"https://bradendubois.dev"}>Braden Dubois</Link>.</p>
                <p>source code <Link href={"https://github.com/bradendubois/vvvv"}>here</Link>.</p>
            </footer>

        </div>
    </>)
}
// export default Home
resetServerContext()

//////////////////////////////////////////////////////

export default App;
