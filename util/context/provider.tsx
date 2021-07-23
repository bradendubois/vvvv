
// Default context with placeholder values
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import useSWR from "swr";
import { codes, regions } from "../api_codes";

import { COVIDDaily, OpenCOVIDDaily } from "../types";
import { dates } from "./dates";
import socrata from "../../pages/api/socrata";



type MapInterface = {
    dateLower: Date
    dateUpper: Date
    setDateLower(date: Date): void
    setDateUpper(date: Date): void
    lowerValid: Date
    upperValid: Date

    canada: RegionEntry
}

type RegionEntry = {
    [key: string]: COVIDDaily[]
}


export const MapContext = createContext<MapInterface>({
    setDateLower: () => {},
    setDateUpper: () => {},
    dateLower: dates.lower.start,
    dateUpper: dates.upper.start,
    lowerValid: dates.lower.limit,
    upperValid: dates.upper.limit,
    canada: {},
});


/**
 * Main context provider for all COVID-related data
 * @param children Any child components this is wrapped around
 * @constructor
 */
export const MapProvider = ({ children }: { children: ReactNode}) => {

    // Canada - fetch data from the OpenCOVID API
    const { data: openCovidData, error: openCovidError } = useSWR('/api/opencovid')
    const [canadaData, setCanadaData] = useState<RegionEntry>({})

    // United States - fetch data from Socrata API
    const { data: socrataData, error: socrataError } = useSWR('/api/socrata')
    const [americaData, setAmericaData] = useState<RegionEntry>({})

    // User-determined filters on data
    const [dateLower, setDateLower] = useState<Date>(dates.lower.start)
    const [dateUpper, setDateUpper] = useState<Date>(dates.upper.start)

    // Clean up Canadian OpenCOVID data
    useEffect(() => {

        if (!openCovidData) return;

        let mapped = openCovidData.covid.map((x: OpenCOVIDDaily) => {

            let s = x.date.split("-")

            let date = new Date()
            date.setDate(parseInt(s[0]))
            date.setMonth(parseInt(s[1])-1)
            date.setFullYear(parseInt(s[2]))
            date.setHours(0, 0, 0, 0)

            let code = codes[x.province as string].code
            let display = codes[x.province as string].display
            let population = openCovidData.population[code]

            return {
                country: "Canada",
                region: code,
                display: display ?? x.province,
                date,
                date_string: x.date,
                active_cases: x.active_cases,
                cases: x.cases,
                cases_cumulative: x.cumulative_cases,

                first_dose: x.avaccine - x.cvaccine,
                first_dose_cumulative: x.cumulative_avaccine -  x.cumulative_cvaccine,

                final_dose: x.cvaccine,
                final_dose_cumulative: x.cumulative_cvaccine,

                first_dose_population: (x.avaccine - x.cvaccine) / population,
                first_dose_population_cumulative: (x.cumulative_avaccine -  x.cumulative_cvaccine) / population,

                final_dose_population: x.cvaccine / population,
                final_dose_population_cumulative: x.cumulative_cvaccine / population,

            }
        })

        let obj: RegionEntry = Object.fromEntries(regions.map(entry => [entry, []]))

        mapped.forEach((point: COVIDDaily) => {
            obj[point.region as string].push(point)
        })

        setCanadaData(obj)

    }, [openCovidData])

    // Clean up Canadian OpenCOVID data
    useEffect(() => {

        if (!socrataData) return;

        console.log(socrataData)
        return;
        let mapped = socrataData.data.map((x: OpenCOVIDDaily) => {

            let s = x.date.split("-")

            let date = new Date()
            date.setDate(parseInt(s[0]))
            date.setMonth(parseInt(s[1])-1)
            date.setFullYear(parseInt(s[2]))
            date.setHours(0, 0, 0, 0)

            let code = codes[x.province as string].code
            let display = codes[x.province as string].display
            let population = openCovidData.population[code]

            return {
                country: "Canada",
                region: code,
                display: display ?? x.province,
                date,
                date_string: x.date,
                active_cases: x.active_cases,
                cases: x.cases,
                cases_cumulative: x.cumulative_cases,

                first_dose: x.avaccine - x.cvaccine,
                first_dose_cumulative: x.cumulative_avaccine -  x.cumulative_cvaccine,

                final_dose: x.cvaccine,
                final_dose_cumulative: x.cumulative_cvaccine,

                first_dose_population: (x.avaccine - x.cvaccine) / population,
                first_dose_population_cumulative: (x.cumulative_avaccine -  x.cumulative_cvaccine) / population,

                final_dose_population: x.cvaccine / population,
                final_dose_population_cumulative: x.cumulative_cvaccine / population,

            }
        })

        let obj: RegionEntry = Object.fromEntries(regions.map(entry => [entry, []]))

        mapped.forEach((point: COVIDDaily) => {
            obj[point.region as string].push(point)
        })

        setCanadaData(obj)


    }, [socrataData])

    // When the lower-bound or upper-bound on dates changes, filter what is presented to the user to within this range
    useEffect(() => {
        // canadaData && dateLower && dateUpper && setFilteredCanada(canadaData.filter(x => x.date >= dateLower && x.date <= dateUpper))
    }, [canadaData, dateLower, dateUpper])

    return (
        <MapContext.Provider value={{
            dateLower,
            dateUpper,
            setDateLower,
            setDateUpper,
            lowerValid: dates.lower.limit,
            upperValid: dates.upper.limit,
            canada: canadaData
        }}>{children}</MapContext.Provider>
    );
}


export const useMapContext = () => { return useContext(MapContext) };
