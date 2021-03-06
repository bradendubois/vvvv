import { useEffect } from "react";
import Head from "next/head";
import Link from "next/link";

import { CountryGraph } from "../components/country";
import Filter from "../components/filter";
import Legend from "../components/legend";

import { useMapContext } from "../util/context/provider";
import { americaCodes, canadaCodes, Country } from "../util/api_codes";
import { COVIDDaily } from "../util/types";

import style from '../styles/Home.module.scss'

/// Colors used in a few areas for consistency
export const color = {
    new_cases: "#bd3253",       // Color for the 'new cases' lines
    first_dose: "#2ca757",      // Color for the first-dose (of a multi-dose) vaccine uptake
    final_dose: "#177ba3"       // Color for the final-dose vaccine uptake
}



/// General representation of a country's data; a unique (per country) code representing one region maps to a
// list of daily data points for that region
export type CountryData = {
    [region: string]: COVIDDaily[]
}

/**
 * 'Main' app for the page; includes visualization, as well as user-selectable components
 * to filter or otherwise alter visualized data
 * @constructor
 */
const App = () => {

    return (<>

        {/* Head component with any metadata for SEO / etc. */}
        <Head>
            <title>Visualizing Variants versus Vaccines</title>

            <meta charSet="UTF-8" />
            <meta name="description" content="Visualization of COVID cases and vaccination data in Canada and the United States." />
            <meta name="keywords" content="COVID,covid-19,vaccination,cases,variants,visualization,canada,america" />
            <meta name="author" content="Dr. Eric Neufeld & Braden Dubois" />
        </Head>

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
                    <p> Grayed out areas indicate graphs that are closest to those of the selected graph segment, which is Saskatchewan for the last 21 days. To select different segment, just click and drag on any graph.</p>
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

            {/* All sources for APIs / data */}
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

            {/* Footer for page */}
            <footer>
                <p>Developed by <Link href={"mailto:emn075@usask.ca"}>Dr. Eric Neufeld</Link> and <Link href={"https://bradendubois.dev"}>Braden Dubois</Link>.</p>
                <p>source code <Link href={"https://github.com/bradendubois/vvvv"}>here</Link>.</p>
            </footer>

        </div>
    </>)
}

//////////////////////////////////////////////////////

export default App;
