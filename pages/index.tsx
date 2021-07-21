import Chart from "../components/chart";
import DateFilter from "../components/dateFilter";

import style from '../styles/Home.module.scss'
import { codes } from "../util/api_codes";


/**
 * 'Main' app for the page; includes visualization, as well as user-selectable components
 * to filter or otherwise alter visualized data
 * @constructor
 */
const Home = () =>  (

    <div className={style.container}>

        <h1>Snazzy Vaccine-related Title, presumably</h1>

        <hr />

        {/* Selector for date range on data */}
        <DateFilter />

        <hr />

        <main className={style.main}>

            {/* Canada Visualization / Graph */}
            <div className={style.canada}>
                {Object.values(codes).filter(x => x.code !== "RP").map(x => <Chart {...x} />)}
            </div>

        </main>
    </div>
)

export default Home
