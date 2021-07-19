import React, {ReactNode, createContext, useContext, useState, useEffect} from "react";
import { CanadaRegions } from "./api_codes";
import useSWR from "swr";

interface Map {
    dateLower?: Date
    dateUpper?: Date
    setDateLower(date: Date): void
    setDateUpper(date: Date): void
    lowerValid?: Date
    upperValid?: Date
    COVIDData: DailyReport[]
    toggleRegion(region: CanadaRegions): void
    ShowRegions: Set<CanadaRegions | String>
}

export const MapContext = createContext<Map>({
    setDateLower: () => {},
    setDateUpper: () => {},
    COVIDData: [],
    toggleRegion() {},
    ShowRegions: new Set()
});

export type DailyReport = {
    active_cases: number
    active_cases_change: number
    avaccine: number
    cases: number
    cumulative_avaccine: number
    cumulative_cases: number
    cumulative_cvaccine: number
    cumulative_deaths: number
    cumulative_dvaccine: number
    cumulative_recovered: number
    cumulative_testing: number
    cvaccine: number
    date: String
    deaths: number
    dvaccine: number
    province: String
    recovered: number
    testing: number
    testing_info: String,

    date_obj: Date
}

const lowerValid = new Date()
lowerValid.setFullYear(2020, 2, 1)

const upperValid = new Date();
upperValid.setHours(0, 0, 0, 0)

export const MapProvider = ({ children }: { children: ReactNode}) => {

    // We fetch data from the OpenCOVID API
    const { data, error } = useSWR('/api/opencovid')

    // User-determined filters on data
    const [dateLower, setDateLower] = useState<Date>()
    const [dateUpper, setDateUpper] = useState<Date>()
    const [regions, setRegions] = useState<Set<CanadaRegions>>(new Set())

    // Results after applying user-defined filters
    const [filteredData, setFilteredData] = useState<DailyReport[]>([])



    const toggleRegion = (region: CanadaRegions) => {
        if (regions.has(region))
            setRegions(new Set(Array.from(regions).filter(x => x !== region)))
        else
            setRegions(new Set(Array.from(regions).concat([region])))
    }

    useEffect(() => {

        data && data.forEach((x: DailyReport) => {

            let s = x.date.split("-")

            let date = new Date()
            date.setDate(parseInt(s[0]))
            date.setMonth(parseInt(s[1])-1)
            date.setFullYear(parseInt(s[2]))
            date.setHours(0, 0, 0, 0)

            x.date_obj = date
        })

    }, [data])

    useEffect(() => {
        // Need valid dates
        if (!(dateLower && dateUpper)) return;
        let filtered = data.filter((x: DailyReport) => x.date_obj >= dateLower && x.date_obj <= dateUpper)
        setFilteredData(filtered)
    }, [dateLower, dateUpper])

    return (
        <MapContext.Provider value={{
            dateLower,
            dateUpper,
            setDateLower,
            setDateUpper,
            lowerValid,
            upperValid,
            COVIDData: filteredData,
            toggleRegion,
            ShowRegions: regions
        }}>{children}</MapContext.Provider>
    );
}


export const useMap = () => { return useContext(MapContext) };
