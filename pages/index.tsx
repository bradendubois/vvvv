import Chart from "../components/chart";
import DateFilter from "../components/dateFilter";

import style from '../styles/Home.module.scss'
import { codes } from "../util/api_codes";
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
                {Object.values(codes).filter(x => x.code !== "RP").map(x => <Chart data={context.canada[x.code]} {...x} />)}
            </div>

            <div>
                {Object.values(codes).filter(x => x.code !== "RP").map(x => <Chart data={context.america[x.code]} {...x} />)}
            </div>

        </main>
    </div>)
}

export default Home
