import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";

import { Country } from "../api_codes";
import { dates } from "./dates";
import { CountryData } from "../../pages";
import { COVIDDaily } from "../types";


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

    useEffect(() => {

        if (canadaData === undefined || americaData === undefined) {
            return
        }

        let threeweeksago = new Date()
        threeweeksago.setDate(threeweeksago.getDate() - 21)
        threeweeksago.setHours(0, 0, 0, 0)

        // By default, search last 21 days in SK
        searchMatch(Country.Canada, "SK", threeweeksago, 21)

    }, [canadaData, americaData])

    /**
     * Computes a basic RMSE between the two sets of daily COVID data
     * @param source One set of data points - usually the one that initiated the search
     * @param target A second set of data points
     */
    const rmse = (source: COVIDDaily[], target: COVIDDaily[]) => {

        if (source.length !== target.length) {
            return -1
            // throw new Error("Non-matching lengths across given parameters")
        }

        let total = 0

        source.forEach((point, index) => {

            let a = point["Avg. Case (Normalized)"]
            let b = target[index]["Avg. Case (Normalized)"]

            // -1 is used as an error value if a range cannot be properly computed
            if (a === undefined || b === undefined) {
                return -1
            }

            total += (a - b) ** 2
        })

        return Math.sqrt(total)
    }


    /**
     * Hook to compute all 'closest' ranges for each dataset; this is used when the user has selected a range on one
     * graph with the intention of finding the best match on all other graphs.
     */
    useEffect(() => {

        if (match === undefined) return

        let source = (match.country === Country.Canada ? canadaData : americaData)

        let target = source?.[match.region]
        if (target === undefined) {
            return
        }

        // Slice desired window from source
        let idx = target.findIndex(x => x.date.getTime() == match?.date.getTime())
        target = target.slice(idx,  idx+match?.points)

        // Helper - computes all updates on one dataset (one country)
        const countryUpdate = (dataset: CountryData) => {

            let data = Object.entries(dataset).map(([k, v]) => {

                let data = v
                let i = 0
                let best

                while (true) {

                    // Slice a window - if it's too small, we've hit passed the end / newest window
                    let slice = data.slice(i, i + (match?.points ?? 0))
                    if (slice.length < (match?.points ?? 1)) {
                        break
                    }

                    // Slice out of viewable range
                    if (slice[0].date < dateLower || slice[slice.length-1].date > dateUpper) {
                        i += 1
                        continue
                    }

                    // Compute RMSE - Update 'best' if better
                    let result = rmse(slice, target ?? [])
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
            })

            return data
        }

        // @ts-ignore
        let canadian = countryUpdate(canadaData)

        // @ts-ignore
        let american = countryUpdate(americaData)

        let threshold = canadian.concat(american)
            // @ts-ignore
            .map(([k, v]) => v.rmse)
            .sort((a, b) => b - a)[4]

        // @ts-ignore
        // Canadian data
        updateMatches(Country.Canada, Object.fromEntries(canadian.filter(([k, v]) => v.rmse >= threshold || v.rmse === 0)))

        // @ts-ignore
        // American data
        updateMatches(Country.America, Object.fromEntries(american.filter(([k, v]) => v.rmse >= threshold || v.rmse === 0)))

    }, [match])

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
