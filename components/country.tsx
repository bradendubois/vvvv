import { useState } from "react";

import Chart from "./chart";
import { Country } from "../util/api_codes";
import { useMapContext } from "../util/context/provider";

import style from "../styles/Country.module.scss";


/// Props for one Country
type CountryProps = {
    country: Country        // The Country (Canada, America)
    initialOrdering: {             // Array to determine ordering of the Charts
        code: string        // Unique identifier of a region within the Country
        display: string     // Value to display above the graph
    }[]
}

export const CountryGraph = ({ country, initialOrdering }: CountryProps) => {

    const context = useMapContext()

    const [ordering, setOrdering] = useState(initialOrdering)

    const data = country == Country.Canada ? context.canadaData : context.americaData

    return (
        <div className={style.country}>
            <h2>{country.charAt(0).toUpperCase() + country.slice(1)}</h2>
            <hr />

            <div className={style.buttons}>

                {data && <button onClick={() => {

                    let x = initialOrdering.slice(0).sort((a, b) => {
                        return a.display.localeCompare(b.display)
                    })

                    setOrdering(x)

                }}>Sort Alphabetically</button>}

                {data && <button onClick={() => {

                    let x = initialOrdering.slice(0).sort((a, b) => {

                        let a_data = data[a.code][data[a.code].length-1]["Avg. Case (Normalized)"]
                        let b_data = data[b.code][data[b.code].length-1]["Avg. Case (Normalized)"]

                        return parseFloat(b_data as unknown as string) - parseFloat(a_data as unknown as string)
                    })

                    setOrdering(x)

                }}>Sort by Cases</button>}
            </div>

            <div className={style.regions}>
                {ordering.map((region, index) => <Chart
                    key={index}
                    country={country}
                    {...region}
                />)}
            </div>

        </div>
    );
}
