import React, { useEffect, useState } from "react";
import Chart from "./chart";
import { Country } from "../util/api_codes";

// @ts-ignore
import { DragDropContext, Draggable, Droppable, resetServerContext } from "react-beautiful-dnd"

import style from "../styles/Country.module.scss";

const reorder = (list: Array<any>, startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

type CountryProps = {
    country: Country
    initialOrdering: {
        code: string
        display: string
    }[]
}

export const CountryGraph = ({ country, initialOrdering }: CountryProps) => {

    const [ordering, setOrdering] = useState(initialOrdering);
    const [scale, setScale] = useState(Object.fromEntries(initialOrdering.map(x => [x.code, 0])))

    /*
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

    const row = 4
     */

    useEffect(() => {
        let sorted = ordering.concat([]).sort((a, b) => {
            return scale[b.code] - scale[a.code]
        })

        setOrdering(sorted)
    }, [scale])

    const recordValue = (region: string, value: number) => {
        setScale({
            ...scale,
            [region]: value
        })
    }

    return (
        <div className={style.country}>
            <h2>{country.charAt(0).toUpperCase() + country.slice(1)}</h2>
            <hr />

            {/*
            <DragDropContext onDragEnd={onDragEnd}>
                {[Array.from(Array(Math.ceil(ordering.length / row)).keys()).map(x => (
                    <Droppable droppableId={`${country}-${x.toString()}`}  direction={"horizontal"}>
                        {(provided: any) => <div ref={provided.innerRef} {...provided.droppableProps} className={style.row}>
                            {Array.from(Array(row).keys()).map((y, i) =>
                                (x * row + 1 < ordering.length) && <Draggable key={ordering[x * row + 1].code} draggableId={ordering[x * row + 1].code} index={i}>
                                    {(provided: any) => (
                                        <p className={style.s}
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >{x * row + i}</p>
                                    )}
                                </Draggable>)}</div>}
                        </Droppable>
                    ))]
                }
            </DragDropContext>
            */}

            {/*
                <Droppable droppableId="list" direction={"horizontal"}>

                    {(provided: any) => (
                        <div ref={provided.innerRef} {...provided.droppableProps} style={{
                            justifyContent: "space-between",
                            display: "flex",
                            flexWrap: "wrap"
                        }}>
*/}
            <div className={style.regions}>
                            {ordering.map((region, index) => (

                                // <Quote quote={quote} index={index} key={quote.id} />
                                /* <Draggable key={region.code} draggableId={region.code} index={index} >
                                    {(provided: any) => (
                                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} >

                                */
                                <Chart {...region} country={country} callback={recordValue} />))}</div>
                            {/* }</div>
                                    )}
                                </Draggable> */}

            {/*
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
                                */}

        </div>
    );
}
