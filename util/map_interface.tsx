import React, {ReactNode, createContext, useContext, useState, useEffect} from "react";
import {CanadaRegions, OpenCOVIDLabel} from "./api_codes";

interface Map {
    selected?: CanadaRegions
    setSelected(select?: CanadaRegions): void
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
    selected: undefined,
    setSelected: () => {},
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
    testing_info: String
}

export const MapProvider = ({ children }: { children: ReactNode}) => {

    const [selected, setSelected] = useState<CanadaRegions>()
    const [dateLower, setDateLower] = useState<Date>()
    const [dateUpper, setDateUpper] = useState<Date>()

    const [data, setDailyData] = useState<DailyReport[]>([])
    const [regions, setRegions] = useState<Set<CanadaRegions>>(new Set())

    const lowerValid = new Date()
    lowerValid.setFullYear(2020, 2, 1)

    const upperValid = new Date();

    const dateFormat = (date: Date): String => {
        return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
    }

    const toggleRegion = (region: CanadaRegions) => {
        if (regions.has(region))
            setRegions(new Set(Array.from(regions).filter(x => x !== region)))
        else
            setRegions(new Set(Array.from(regions).concat([region])))
    }

    useEffect(() => {

        // Need valid dates, and a location
        if (!(dateLower && dateUpper)) return;

        fetch(`https://api.opencovid.ca/summary?after=${dateFormat(dateLower ?? lowerValid)}&before=${dateFormat(dateUpper ?? upperValid)}`)
            .then(res => res.json())
            .then(res => setDailyData(res.summary))

    }, [dateLower, dateUpper])

    return (
        <MapContext.Provider value={{
            selected,
            setSelected,
            dateLower,
            dateUpper,
            setDateLower,
            setDateUpper,
            lowerValid,
            upperValid,
            COVIDData: data,
            toggleRegion,
            ShowRegions: regions
        }}>{children}</MapContext.Provider>
    );
}


export const useMap = () => { return useContext(MapContext) };