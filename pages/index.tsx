import Head from "next/head";
import Link from "next/link";
import React, { useState } from "react";
// @ts-ignore TODO
import { DragDropContext, Draggable, Droppable, resetServerContext } from "react-beautiful-dnd"
import Chart from "../components/chart";

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


const reorder = (list: Array<any>, startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

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

            <main className={style.main}>

                {/* Canada Visualization / Graph */}
                <h2>Canada</h2>
                <hr />

                <CountryGraph country={Country.Canada} initialOrdering={canadaCodes} />

                <h2>United States</h2>
                <hr />
                <div className={style.america}>
                    <CountryGraph country={Country.America} initialOrdering={americaCodes} />
                </div>

            </main>

            <hr/>

            <div>
                <h2>Sources</h2>
                <ul>
                    <li>Canadian data accessed from the <a href={"https://opencovid.ca/api/"}>OpenCOVID API</a>.</li>
                    <li>Canadian dataset is the COVID-19 Open Data Working Group, available <a href={"https://opencovid.ca/work/dataset/"}>here</a>.</li>
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

type CountryProps = {
    country: Country
    initialOrdering: {
        code: string
        display: string
    }[]
}

const CountryGraph = ({ country, initialOrdering }: CountryProps) => {

    const [ordering, setOrdering] = useState(initialOrdering);

    function onDragEnd(result: any) {

        if (!result.destination) {
            return;
        }

        if (result.destination.index === result.source.index) {
            return;
        }

        const quotes = reorder(
            ordering,
            result.source.index,
            result.destination.index
        );

        setOrdering(quotes);
    }

    return (
        <div className={style.canada}>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="list" direction={"horizontal"}>
                    {(provided: any) => (
                        <div ref={provided.innerRef} {...provided.droppableProps} style={{
                            justifyContent: "space-between",
                            display: "flex",
                            flexWrap: "wrap"
                        }}>

                            {ordering.map((region, index) => (

                                // <Quote quote={quote} index={index} key={quote.id} />
                                <Draggable key={region.code} draggableId={region.code} index={index} >
                                    {(provided: any) => (
                                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} >
                                            <Chart {...region} country={country}/>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
}

export default App;
