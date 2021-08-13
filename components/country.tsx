import React, { useEffect, useState } from "react";
import Chart from "./chart";
import { Country } from "../util/api_codes";

// @ts-ignore
import { DragDropContext, Draggable, Droppable, resetServerContext } from "react-beautiful-dnd"

import style from "../styles/Country.module.scss";
import { COVIDDaily } from "../util/types";

const reorder = (list: Array<any>, startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

type CountryProps = {
    country: Country
    ordering: {
        code: string
        display: string
    }[]
    data: {
        [region: string]: {
            match?: {
                startDate: Date
                rmse: number
            }
            data: COVIDDaily[]
        }
    }
}

export const CountryGraph = ({ country, ordering }: CountryProps) => {

    return (
        <div className={style.country}>
            <h2>{country.charAt(0).toUpperCase() + country.slice(1)}</h2>
            <hr />

            <div className={style.regions}>
                {ordering.map((region, index) => <Chart
                    key={index}
                    country={country}
                    {...region} />)}
            </div>

        </div>
    );
}
