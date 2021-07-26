import Chart from "../components/chart";
import DateFilter from "../components/dateFilter";

import style from '../styles/Home.module.scss'
import { americaCodes, canadaCodes, Country } from "../util/api_codes";
import { useMapContext } from "../util/context/provider";


export const color = {
    active_cases: "#bd3253",
    first_dose: "#2ca757",
    final_dose: "#177ba3"
}


/**
 * 'Main' app for the page; includes visualization, as well as user-selectable components
 * to filter or otherwise alter visualized data
 * @constructor
 */
const Home = () => {

    const context = useMapContext()

    return (

        <div className={style.container}>

        <h1>Snazzy Vaccine-related Title, presumably</h1>

        <hr/>

        {/* Selector for date range on data */}
        <DateFilter/>

        <hr/>

        {/* Basic 'legend' to indicate line values */}
        <div className={style.colors}>
            <div>
                <div style={{backgroundColor: color.active_cases}}/>
                <p>Active Cases</p>
            </div>

            <div>
                <div style={{backgroundColor: color.first_dose}}/>
                <p>First Dose</p>
            </div>

            <div>
                <div style={{backgroundColor: color.final_dose}}/>
                <p>Second / Final Dose</p>
            </div>
        </div>

        <main className={style.main}>

            {/* Canada Visualization / Graph */}
            <div className={style.canada}>
                {Object.values(canadaCodes).filter(x => x.code !== "RP").map(x => <Chart country={Country.Canada} region={x.code} display={x.display}/>)}
            </div>

            <div>
                {Object.entries(americaCodes).filter(x => x[0] !== "RP").map(x => <Chart country={Country.America} region={x[0]} display={x[1]} />)}
            </div>

        </main>
    </div>)
}

export default Home
