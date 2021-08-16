import Chart from "./chart";
import { Country } from "../util/api_codes";

import style from "../styles/Country.module.scss";


/// Props for one Country
type CountryProps = {
    country: Country        // The Country (Canada, America)
    ordering: {             // Array to determine ordering of the Charts
        code: string        // Unique identifier of a region within the Country
        display: string     // Value to display above the graph
    }[]
}

export const CountryGraph = ({ country, ordering }: CountryProps) => {

    return (
        <div className={style.country}>
            <h2>{country.charAt(0).toUpperCase() + country.slice(1)}</h2>
            <hr />

            <div className={style.regions}>
                {ordering.map((region, index) => <Chart
                    key={index}
                    country={country}
                    {...region} />)}
            </div>

        </div>
    );
}
