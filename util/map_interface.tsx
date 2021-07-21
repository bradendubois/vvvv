import React, {ReactNode, createContext, useContext, useState, useEffect} from "react";
import useSWR from "swr";
import { CanadaRegions, codes } from "./api_codes";


type MapInterface = {
    dateLower?: Date
    dateUpper?: Date
    setDateLower(date: Date): void
    setDateUpper(date: Date): void
    lowerValid?: Date
    upperValid?: Date
    COVIDData: OpenCOVIDDaily[]

    canada: COVIDDaily[]

    toggleRegion(region: CanadaRegions): void
    ShowRegions: Set<CanadaRegions | String>
}


// Default context with placeholder values
export const MapContext = createContext<MapInterface>({
    setDateLower: () => {},
    setDateUpper: () => {},
    COVIDData: [],
    canada: [],
    toggleRegion() {},
    ShowRegions: new Set()
});


// One daily summary for one region in Canada
export type OpenCOVIDDaily = {

    active_cases: number
    active_cases_change: number
    date: String
    province: String
    testing_info: String,
    date_obj: Date  // A JS Date object created from 'date' to enable easier comparisons

    avaccine: number    // total vaccines administered (first & second doses included)
    cases: number
    cvaccine: number    // 'completed' vaccines (second doses, or any single-doses administered)
    deaths: number
    dvaccine: number    // vaccines distributed
    recovered: number
    testing: number
    cumulative_avaccine: number
    cumulative_cases: number
    cumulative_cvaccine: number
    cumulative_deaths: number
    cumulative_dvaccine: number
    cumulative_recovered: number
    cumulative_testing: number
}


// Type that both Canada and US data will be converted to
export type COVIDDaily = {

    country: String
    region: String
    date: Date

    active_cases: number
    cases: number
    cases_cumulative: number

    first_dose: number
    first_dose_cumulative: number

    final_dose: number
    final_dose_cumulative: number

    deaths: number
    deaths_cumulative: number
}


// Lower-bound: Jan 1 2020
const lowerValid = new Date()
lowerValid.setFullYear(2020, 0, 1)

// Upper-bound: Current date
const upperValid = new Date();

// Clear the 'time' to fix comparisons on the same day, as time is set when the Date object is created
lowerValid.setHours(0, 0, 0, 0)
upperValid.setHours(0, 0, 0, 0)

/**
 * Main context provider for all COVID-related data
 * @param children Any child components this is wrapped around
 * @constructor
 */
export const MapProvider = ({ children }: { children: ReactNode}) => {

    // We fetch data from the OpenCOVID API
    const { data, error } = useSWR('/api/opencovid')

    // User-determined filters on data
    const [dateLower, setDateLower] = useState<Date>(lowerValid)
    const [dateUpper, setDateUpper] = useState<Date>(upperValid)
    const [regions, setRegions] = useState<Set<CanadaRegions>>(new Set())

    // Results after applying user-defined filters
    const [filteredData, setFilteredData] = useState<OpenCOVIDDaily[]>([])



    const [canadaData, setCanadaData] = useState<COVIDDaily[]>([])
    const [filteredCanada, setFilteredCanada] = useState<COVIDDaily[]>([])


    // Once the data finally comes back from our API call, convert the dates to 'real' Date objects for comparisons
    useEffect(() => {

        data && setCanadaData(data.map((x: OpenCOVIDDaily) => {

            let s = x.date.split("-")

            let date = new Date()
            date.setDate(parseInt(s[0]))
            date.setMonth(parseInt(s[1])-1)
            date.setFullYear(parseInt(s[2]))
            date.setHours(0, 0, 0, 0)
            console.log(x)
            return {
                country: "Canada",
                region: codes[x.province as string].code,
                display: codes[x.province as string].display ?? x.province,
                date,
                active_cases: x.active_cases,
                cases: x.cases,
                cases_cumulative: x.cumulative_cases,
                first_dose: x.avaccine - x.cvaccine,
                first_dose_cumulative: x.cumulative_avaccine -  x.cumulative_cvaccine,
            }
        }))

    }, [data])

    // When the lower-bound or upper-bound on dates changes, filter what is presented to the user to within this range
    useEffect(() => {
        canadaData && dateLower && dateUpper && setFilteredCanada(canadaData.filter(x => x.date >= dateLower && x.date <= dateUpper))
    }, [canadaData, dateLower, dateUpper])

    /**
     * Toggle a region as being 'selected' or desired to show in any visualization areas
     * @param region A Region to show or stop showing
     */
    const toggleRegion = (region: CanadaRegions) => {
        // Q: Why not just add/remove the element?
        // A: The address of `regions` must change to fire anything watching it
        if (regions.has(region)) {
            setRegions(new Set(Array.from(regions).filter(x => x !== region)))
        } else {
            setRegions(new Set(Array.from(regions).concat([region])))
        }
    }

    return (
        <MapContext.Provider value={{
            dateLower,
            dateUpper,
            setDateLower,
            setDateUpper,
            lowerValid,
            upperValid,
            COVIDData: filteredData,
            canada: filteredCanada,
            toggleRegion,
            ShowRegions: regions
        }}>{children}</MapContext.Provider>
    );
}


export const useMapContext = () => { return useContext(MapContext) };
