import React, {ReactNode, createContext, useContext, useState, useEffect} from "react";
import {OpenCOVID} from "./api_codes";

interface Map {
    selected?: OpenCOVID,
    setSelected(select?: OpenCOVID): void;
}

export const MapContext = createContext<Map>({
    selected: undefined,
    setSelected: () => {}},
);

export const MapProvider = ({ children }: { children: ReactNode}) => {

    const [selected, setSelected] = useState<OpenCOVID>()

    useEffect(() => {
        if (!selected) return;

        fetch(`https://api.opencovid.ca/summary?date=7-1-2021`)
            .then(res => res.json())
            .then(res => {
                console.log(res)
            })

    }, [selected])

    return (
        <MapContext.Provider value={{
            selected,
            setSelected
        }}>{children}</MapContext.Provider>
    );
}


export const useMap = () => { return useContext(MapContext) };