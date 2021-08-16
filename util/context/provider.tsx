import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

import { americaCodes, canadaCodes, Country } from "../api_codes";
import { dates } from "./dates";
import { CountryData, SearchMatch } from "../../pages";

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


    canadaData?: CountryData
    americaData?: CountryData
    canadaMatches?: SearchMatch
    americaMatches?: SearchMatch

    updateMatches(country: Country, data: SearchMatch): void

    size: {
        height: number
        width: number
    }
    toggleMini(): void
}


const sizes = {
    mini: {
        height: 150,
        width: 250
    },

    default: {
        height: 225,
        width: 325
    }
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
    canadaData: {},
    americaData: {},
    canadaMatches: {},
    americaMatches: {},
    updateMatches: () => {},
    size: {
        height: 100,
        width: 100
    },
    toggleMini: () =>  {}
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

    // COVID Data
    const [canadaData, setCanadaData] = useState<CountryData>()
    const [americaData, setAmericaData] = useState<CountryData>()

    // Search Matches
    const [canadaMatches, setCanadaMatches] = useState<SearchMatch>()
    const [americaMatches, setAmericaMatches] = useState<SearchMatch>()

    const [size, setSize] = useState(sizes.default)

    useEffect(() => {

        fetch('/api/canada').then(result => result.json())
            .then(result => {
                Object.values(result).forEach((region) => {
                    // @ts-ignore
                    region.forEach((day: any) =>
                        day.date = new Date(day.date as unknown as string)
                    )
                })

                setCanadaData(result)
            })


        fetch('/api/america').then(result => result.json())
            .then(result => {
                Object.values(result).forEach((region) => {
                    // @ts-ignore
                    region.forEach((day: any) =>
                        day.date = new Date(day.date as unknown as string)
                    )
                })

                setAmericaData(result)
            })

     }, [])

    const toggleMini = () => {

        if (size === sizes.default) {
            setSize(sizes.mini)
        } else {
            setSize(sizes.default)
        }

    }

    const searchMatch = (country: Country, region: string, date: Date, points: number) => setMatch({
        country,
        region,
        date,
        points
    })

    const updateMatches = (country: Country, data: SearchMatch) => {

        console.log(data)

        switch (country) {
            case Country.Canada:
                setCanadaMatches(data)
                break
            case Country.America:
                setAmericaMatches(data)
                break
            default:
                throw Error
        }
    }

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

            canadaData,
            americaData,
            canadaMatches,
            americaMatches,
            updateMatches,

            size,
            toggleMini
        }}>{children}</MapContext.Provider>
    );
}


export const useMapContext = () => { return useContext(MapContext) };
