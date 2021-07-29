import Head from "next/head";
import Link from "next/link";
import React, { useState } from "react";
// @ts-ignore TODO
import { DragDropContext, Draggable, Droppable, resetServerContext } from "react-beautiful-dnd"
import Chart from "../components/chart";

import Filter from "../components/filter";
import { canadaCodes, Country } from "../util/api_codes";

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
const Home = () => {

    const context = useMapContext()

    const [canada, setCanada] = useState(canadaCodes)

    const [test, setTest] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9])

    const onDragEnd = (result: any) => {
        if (!result.destination) {
            return
        }

        if (result.destination.index === result.source.index) {
            return
        }

        const newOrder = reorder(
            test,
            result.source.index,
            result.destination.index
        )

        setTest(newOrder)
    }

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

                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId={"canada"}>
                        {(provided: any) => (
                            <div {...provided.droppableProps} ref={provided.innerRef} /*className={style.canada}*/ >
                                {Object.values(canada).map((x, index) =>
                                    <Draggable
                                        key={x.code}
                                        draggableId={x.code}
                                        index={index}
                                    >{(provided: any) => (
                                        <Chart
                                            ref={provided.innerRef}
                                            {...provided}
                                            country={Country.Canada}
                                            {...x}
                                        />
                                    )}
                                    </Draggable>
                                )}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>

                {/*
                <h2>United States</h2>
                <hr />
                <div className={style.america}>
                    {Object.entries(americaCodes).map(x => <Chart country={Country.America} region={x[0]} display={x[1]} />)}
                </div>
                */}

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

function App() {

    const [state, setState] = useState(canadaCodes);

    function onDragEnd(result) {
        if (!result.destination) {
            return;
        }

        if (result.destination.index === result.source.index) {
            return;
        }

        const quotes = reorder(
            state,
            result.source.index,
            result.destination.index
        );

        setState(quotes);
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="list">
                {(provided: any) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>

                        {state.map((quote, index: number) => (

                            // <Quote quote={quote} index={index} key={quote.id} />
                            <Draggable key={quote.code} draggableId={quote.code} index={index}>
                                {(provided: any) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                    >
                                        <Chart
                                        {...quote}
                                        country={Country.Canada}

                                        />
                                    </div>
                                )}
                            </Draggable>


                        ))}




                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
}


export default App;




