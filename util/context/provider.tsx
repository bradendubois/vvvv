import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

import { Country } from "../api_codes";
import { dates } from "./dates";
import { COVIDDaily } from "../types";

type Match = {
    country: Country
    region: string
    points: COVIDDaily[]
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
    searchMatch(country: Country, region: string, points: COVIDDaily[]): void
    best?: {
        [region: string]: {
            date: Date
            rmse: number
        }
    }
    reportBest(country: Country, region: string, date: Date, rmse: number): void
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
    reportBest: () => {}
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
    const [best, setBest] = useState<{[region: string]: { date: Date, rmse: number}}>()

    const searchMatch = (country: Country, region: string, points: COVIDDaily[]) => setMatch({
        country,
        region,
        points
    })

    const reportBest = (country: Country, region: string, date: Date, rmse: number) => setBest({
        ...best,
        [`${country}-${region}`]: {
            date,
            rmse
        }
    })

    useEffect(() => { console.log(best) }, [best])

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
            searchMatch,
            best,
            reportBest
        }}>{children}</MapContext.Provider>
    );
}


export const useMapContext = () => { return useContext(MapContext) };
