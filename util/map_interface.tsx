import React, {ReactNode, createContext, useContext, useState, useEffect} from "react";
import {OpenCOVID} from "./api_codes";

interface Map {
    selected?: OpenCOVID
    setSelected(select?: OpenCOVID): void
    dateLower?: Date
    dateUpper?: Date
    setDateLower(date: Date): void
    setDateUpper(date: Date): void
    lowerValid?: Date
    upperValid?: Date
}

export const MapContext = createContext<Map>({
    selected: undefined,
    setSelected: () => {},
    setDateLower: () => {},
    setDateUpper: () => {},
});

export const MapProvider = ({ children }: { children: ReactNode}) => {

    const [selected, setSelected] = useState<OpenCOVID>()
    const [dateLower, setDateLower] = useState<Date>()
    const [dateUpper, setDateUpper] = useState<Date>()

    const lowerValid = new Date()
    lowerValid.setFullYear(2020, 2, 1)

    const upperValid = new Date()

    useEffect(() => {
        if (!selected) return;

        fetch(`https://api.opencovid.ca/summary?loc=${selected}&date=7-1-2021`)
            .then(res => res.json())
            .then(res => {
                console.log(res)
            })

    }, [selected])

    return (
        <MapContext.Provider value={{
            selected,
            setSelected,
            dateLower,
            dateUpper,
            setDateLower,
            setDateUpper,
            lowerValid,
            upperValid
        }}>{children}</MapContext.Provider>
    );
}


export const useMap = () => { return useContext(MapContext) };