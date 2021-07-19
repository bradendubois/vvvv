import Graph from "../components/graph";
import CanadaMap from "../components/canadaMap";

import styles from '../styles/Home.module.scss'


const Home = () =>  (

    <div className={styles.container}>

        <main className={styles.main}>

            {/* Visualization / Graph */}
            <Graph />

            {/* Picker of Canadian regions */}
            <CanadaMap />

        </main>
    </div>
)

export default Home
