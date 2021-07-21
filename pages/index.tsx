import Chart from "../components/chart";
import CanadaMap from "../components/canadaMap";
import DateFilter from "../components/dateFilter";

import styles from '../styles/Home.module.scss'


/**
 * 'Main' app for the page; includes visualization, as well as user-selectable components
 * to filter or otherwise alter visualized data
 * @constructor
 */
const Home = () =>  (

    <div className={styles.container}>

        <main className={styles.main}>

            {/* Visualization / Graph */}
            <Chart />

            {/* Selector for date range on data */}
            <DateFilter />

            <hr />

            {/* Picker of Canadian regions */}
            <CanadaMap />

        </main>
    </div>
)

export default Home
