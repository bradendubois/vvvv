import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

import { Country } from "../api_codes";
import { dates } from "./dates";
import { COVIDDaily } from "../types";

type Match = {
    country: Country
    date: Date
    region: string
    points: number
}


type MapInterface = {
    dateLower: Date
    dateUpper: Date
    setDateLower(date: Date): void
    setDateUpper(date: Date): void
    lowerValid: Date
    upperValid: Date
    setUpperThreshold(x: number): void
    upperThreshold: number
    setLowerThreshold(x: number): void
    lowerThreshold: number
    match?: Match
    searchMatch(country: Country, region: string, date: Date, points: number): void
}


export const MapContext = createContext<MapInterface>({
    setDateLower: () => {},
    setDateUpper: () => {},
    dateLower: dates.lower.start,
    dateUpper: dates.upper.start,
    lowerValid: dates.lower.limit,
    upperValid: dates.upper.limit,
    setUpperThreshold: () => {},
    upperThreshold: 15,
    setLowerThreshold: () => {},
    lowerThreshold: 15,
    searchMatch: () => {},
});


/**
 * Main context provider for all COVID-related data
 * @param children Any child components this is wrapped around
 * @constructor
 */
export const MapProvider = ({ children }: { children: ReactNode}) => {

    // User-determined filters on data
    const [dateLower, setDateLower] = useState<Date>(dates.lower.start)
    const [dateUpper, setDateUpper] = useState<Date>(dates.upper.start)

    // Threshold a graph's daily cases should flag
    const [lowerThreshold, setLowerThreshold] = useState(9)
    const [upperThreshold, setUpperThreshold] = useState(18)

    const [match, setMatch] = useState<Match>()

    const searchMatch = (country: Country, region: string, date: Date, points: number) => setMatch({
        country,
        date,
        region,
        points
    })

    return (
        <MapContext.Provider value={{
            dateLower,
            dateUpper,
            setDateLower,
            setDateUpper,
            lowerValid: dates.lower.limit,
            upperValid: dates.upper.limit,
            setUpperThreshold,
            upperThreshold,
            setLowerThreshold,
            lowerThreshold,
            match,
            searchMatch
        }}>{children}</MapContext.Provider>
    );
}


export const useMapContext = () => { return useContext(MapContext) };
