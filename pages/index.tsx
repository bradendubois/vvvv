import { useEffect } from "react";
import Head from "next/head";
import Link from "next/link";

// @ts-ignore TODO
import { resetServerContext } from "react-beautiful-dnd"

import { CountryGraph } from "../components/country";
import Filter from "../components/filter";
import Legend from "../components/legend";

import { americaCodes, canadaCodes, Country } from "../util/api_codes";

import style from '../styles/Home.module.scss'
import { COVIDDaily } from "../util/types";
import { useMapContext } from "../util/context/provider";

resetServerContext()

export const color = {
    active_cases: "#bd3253",
    first_dose: "#2ca757",
    final_dose: "#177ba3"
}


type Match = {
    country: Country
    region: string
    points: COVIDDaily[]
}

const initial = {
    canada: Object.fromEntries(canadaCodes.map(entry => [entry.code, undefined])),
    america: Object.fromEntries(americaCodes.map(entry => [entry.code, undefined]))
}


export type SearchMatch = {
    [region: string]: {
        startDate: Date
        rmse: number
        points: number
    }
}

export type CountryData = {
    [region: string]: COVIDDaily[]
}

/**
 * 'Main' app for the page; includes visualization, as well as user-selectable components
 * to filter or otherwise alter visualized data
 * @constructor
 */
const App = () => {

    const context = useMapContext()

    const rmse = (source: COVIDDaily[], target: COVIDDaily[]) => {

        if (source.length !== target.length) {
            throw new Error("Non-matching lengths across given parameters")
        }

        let total = 0

        source.forEach((point, index) => {

            let a = point["Average Daily Case (Normalized)"]
            let b = target[index]["Average Daily Case (Normalized)"]

            if (a !== undefined && b !== undefined) {
                total += (a - b) ** 2
            } else {
                return -1
            }
        })

        return Math.sqrt(total)
    }


    useEffect(() => {

        if (context.match === undefined) return

        let source = (context.match.country === Country.Canada ? context.canadaData : context.americaData)

        let target = source?.[context.match.region]

        if (target === undefined) {
            return
        }

        let idx = target.findIndex(x => x.date.getTime() == context.match?.date.getTime())
        target = target.slice(idx,  idx+context.match?.points)

        const countryUpdate = (dataset: CountryData) => {

            let data = Object.fromEntries(Object.entries(dataset).map(([k, v]) => {

                let data = v
                let i = 0
                let best

                while (true) {

                    // @ts-ignore
                    let slice = data.slice(i, i + context.match?.points)
                    // @ts-ignore
                    if (slice.length < context.match?.points) {
                        break
                    }

                    // @ts-ignore
                    let result = rmse(slice, target)
                    if (result != -1 && (!best || result < best.rmse)) {
                        best = {
                            rmse: result,
                            startDate: slice[0].date,
                            points: slice.length
                        }
                    }

                    i += 1
                }

                return [k, best]
            }))

            return data
        }

        // @ts-ignore
        context.updateMatches(Country.Canada, countryUpdate(context.canadaData))
        // @ts-ignore
        context.updateMatches(Country.America, countryUpdate(context.americaData))

        // countryUpdate(americaData)

    }, [context.match])

    return (<>

        <Head>
            <title>Visualizing Variants versus Vaccines</title>

            <meta charSet="UTF-8" />
            <meta name="description" content="Visualization of COVID cases and vaccination data in Canada and the United States." />
            <meta name="keywords" content="COVID,covid-19,vaccination,cases,variants,visualization,canada,america" />
            <meta name="author" content="Dr. Eric Neufeld & Braden Dubois" />
        </Head>

        {/* (process.env.BUILD !== "PRODUCTION") && <div className={style.development}>
            <p>This is a <strong>development</strong> build! Stability, performance, feature availability, and correctness are not guaranteed!</p>
            <p>Click <Link href={"https://vvvv-main.vercel.app"}>here</Link> to go to the latest production build.</p>
        </div>*/}

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
                <CountryGraph country={Country.Canada} ordering={canadaCodes} />
                <CountryGraph country={Country.America} ordering={americaCodes} />
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

//////////////////////////////////////////////////////

export default App;
