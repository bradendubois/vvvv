import Graph from "../components/graph";
import CanadaMap from "../components/canadaMap";
import DateFilter from "../components/dateFilter";

import styles from '../styles/Home.module.scss'


const Home = () =>  (

    <div className={styles.container}>

        <main className={styles.main}>

            {/* Visualization / Graph */}
            <Graph />

            {/* Selector for date range on data */}
            <DateFilter />

            <hr />

            {/* Picker of Canadian regions */}
            <CanadaMap />

        </main>
    </div>
)

export default Home
