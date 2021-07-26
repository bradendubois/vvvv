
// Default context with placeholder values
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import useSWR from "swr";
import { codes, regions } from "../api_codes";

import { COVIDDaily, OpenCOVIDDaily, SocrataVaccinationDaily } from "../types";
import { dates } from "./dates";


type MapInterface = {
    dateLower: Date
    dateUpper: Date
    setDateLower(date: Date): void
    setDateUpper(date: Date): void
    lowerValid: Date
    upperValid: Date

    canada: RegionEntry
    america: RegionEntry
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
    america: {}
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

        let mapped = socrataData.vaccination.map((x: SocrataVaccinationDaily) => {

            // The dates returned are initially a string
            let date = new Date(x.date as unknown as string)

            let code = codes[x.location as string].code

            return {
                country: "United States",
                region: code,
                display: codes[x.location as string].display ?? x.location,
                date,
                date_string: x.date,
                active_cases: 0,
                cases: 0,
                cases_cumulative: 0,

                first_dose: 0,
                first_dose_cumulative: parseInt(x.administered_dose1_recip),

                final_dose: 0,
                final_dose_cumulative: parseInt(x.series_complete_yes),

                first_dose_population: 0,
                first_dose_population_cumulative: parseInt(x.administered_dose1_pop_pct),

                final_dose_population: 0,
                final_dose_population_cumulative: parseInt(x.series_complete_pop_pct),

            }
        })

        let obj: RegionEntry = Object.fromEntries(regions.map(entry => [entry, []]))

        mapped.forEach((point: COVIDDaily) => {
            obj[point.region as string].push(point)
        })

        setAmericaData(obj)

    }, [socrataData])

    return (
        <MapContext.Provider value={{
            dateLower,
            dateUpper,
            setDateLower,
            setDateUpper,
            lowerValid: dates.lower.limit,
            upperValid: dates.upper.limit,
            america: americaData,
            canada: canadaData,
        }}>{children}</MapContext.Provider>
    );
}


export const useMapContext = () => { return useContext(MapContext) };
