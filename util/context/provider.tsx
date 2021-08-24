import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";

import { Country } from "../api_codes";
import { dates } from "./dates";
import { CountryData } from "../../pages";


/// A 'result' computed for each region when searching for a range that best fits a source/selected range
type SearchMatch = {
    [region: string]: {
        startDate: Date
        rmse: number
        points: number
    }
}


/// The Match from a search / selected range
type Match = {
    country: Country    // The Country the search originates from
    date: Date          // The date the search begins on
    region: string      // The region of the search
    points: number      // The number of points selected
}


/// Interface for a Context provider to give date ranges, threshold values, and data to Country/Chart components
type MapInterface = {

    /// Ranges on dates for filtering data previewed in the Graphs
    dateLower: Date     // Lower-bound selected
    dateUpper: Date     // Upper-bound selected
    lowerValid: Date    // Lowest valid date
    upperValid: Date    // Highest valid date
    setDateLower(date: Date): void      // Setter for lower-bound
    setDateUpper(date: Date): void      // Setter for upper-bound

    /// Shading on the background of graphs as a way to indicate the upper-bound data point's case data
    /// Three regions: Lower, Middle/Medium, Upper/High
    lowerThreshold: number  // Value above which (but below upper) is considered medium
    upperThreshold: number  // Value above which is considered high
    setLowerThreshold(x: number): void  // Setter the lower/medium boundary
    setUpperThreshold(x: number): void  // Setter for the medium/upper boundary
    ymax: number                // y-axis maximum for graph
    setYmax(x: number): void    // setter for y-max
    /// Data on COVID Cases / Vaccinations for each country
    canadaData?: CountryData
    americaData?: CountryData

    /// Regions to highlight for each country (results of a search by click+dragging over a region on any graph)
    canadaMatches?: SearchMatch
    americaMatches?: SearchMatch

    /// Selected range to match in all Charts
    match?: Match

    clearMatches(): void        // Clear all selected regions
    searchMatch(country: Country, region: string, date: Date, points: number): void     // Call to begin a search
    updateMatches(country: Country, data: SearchMatch): void    // Updates a country's data on what regions should be highlighted

    /// Size of the charts in pixels
    size: {
        height: number
        width: number
    }
    toggleMini(): void  // Toggle between the small/normal views
}


// Sizes of the Charts in pixel values
export const sizes = {
    mini: {
        height: 125,
        width: 225
    },

    default: {
        height: 225,
        width: 325
    }
}

// Placeholder / fallback context
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
    ymax: 25,
    setYmax: () => {},
    searchMatch: () => {},
    canadaData: {},
    americaData: {},
    canadaMatches: {},
    americaMatches: {},
    updateMatches: () => {},
    clearMatches: () => {},
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

    // Data on a range selected by the user to search for similar regions on
    const [match, setMatch] = useState<Match>()

    // COVID Data
    const [canadaData, setCanadaData] = useState<CountryData>()
    const [americaData, setAmericaData] = useState<CountryData>()

    // Search Matches
    const [canadaMatches, setCanadaMatches] = useState<SearchMatch>()
    const [americaMatches, setAmericaMatches] = useState<SearchMatch>()

    const [size, setSize] = useState(sizes.default)
    const [ymax, setymax] = useState(25)

    /// Get all data for the Graphs from OpenCOVID and Socrata
    useEffect(() => {

        /// Canadian Data - OpenCOVID
        fetch('/api/canada').then(result => result.json())
            .then(result => {
                Object.values(result).forEach((region) => {
                    // @ts-ignore
                    region.forEach((day: any) => {
                            day.date = new Date(day.date as unknown as string)
                            day.date.setHours(0, 0, 0, 0)
                        }
                    )
                })

                setCanadaData(result)
            })

        /// American Data - Socrata
        fetch('/api/america').then(result => result.json())
            .then(result => {
                Object.values(result).forEach((region) => {
                    // @ts-ignore
                    region.forEach((day: any) => {
                            day.date = new Date(day.date as unknown as string)
                            day.date.setHours(0, 0, 0, 0)
                        }
                    )
                })

                setAmericaData(result)
            })

     }, [])

    /// Toggle sizes of the graphs
    const toggleMini = () => {
        if (size === sizes.default) {
            setSize(sizes.mini)
        } else {
            setSize(sizes.default)
        }
    }

    /// Clear all search result data
    const clearMatches = () =>  {
        setCanadaMatches({})
        setAmericaMatches({})
    }

    /// Kick off a search in all charts
    const searchMatch = (country: Country, region: string, date: Date, points: number) => setMatch({
        country,
        region,
        date,
        points
    })

    /// Sets the resulting data for a country of regions that should be highlighted
    const updateMatches = (country: Country, data: SearchMatch) => {

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

            lowerThreshold,
            upperThreshold,
            setLowerThreshold,
            setUpperThreshold,

            ymax,
            setYmax: setymax,

            canadaData,
            americaData,
            canadaMatches,
            americaMatches,
            match,
            clearMatches,
            searchMatch,
            updateMatches,

            size,
            toggleMini
        }}>{children}</MapContext.Provider>
    );
}


export const useMapContext = () => { return useContext(MapContext) };
