import Chart from "../components/chart";
import DateFilter from "../components/dateFilter";

import style from '../styles/Home.module.scss'
import { CanadaCodes, CanadaRegions, codes, regions } from "../util/api_codes";


/**
 * 'Main' app for the page; includes visualization, as well as user-selectable components
 * to filter or otherwise alter visualized data
 * @constructor
 */
const Home = () =>  (

    <div className={style.container}>

        <main className={style.main}>

            {/* Canada Visualization / Graph */}
            <div className={style.canada}>
                {Object.values(codes).filter(x => x.code !== "RP").map(x => <Chart {...x} />)}
            </div>

            {/* Selector for date range on data */}
            <DateFilter />
        </main>
    </div>
)

export default Home
