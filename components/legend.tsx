import { color } from "../pages";

import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";

import style from "../styles/Legend.module.scss"

const example = [{
    new_cases_deaths_normalized_100k_average: 15,
    first_dose_population_cumulative: 0.55,
    final_dose_population_cumulative: 0.20,
    date: "Lower Date"
}, {
    new_cases_deaths_normalized_100k_average: 13,
    first_dose_population_cumulative: 0.65,
    final_dose_population_cumulative: 0.45,
    date: "Intermediary Date"
}, {
    new_cases_deaths_normalized_100k_average: 7,
    first_dose_population_cumulative: 0.75,
    final_dose_population_cumulative: 0.50,
    date: "Upper Date"
}]

const LegendLine = ({ color, label}: { color: string, label: string }) => (
    <div className={style.line}>
        {Array.from(Array(4).keys()).map(i => <div key={i} style={{
            backgroundColor: color
        }} />)}
        <p>{label}</p>
    </div>
)

const LegendCase = ({ level, label }: { label: string, level: string }) => (
    <div className={style.case}>
        <div className={style[level]}/>
        <p>{label}</p>
    </div>
)

const Legend = () => {
    return (
        <div className={style.container}>

            <h1>Legend</h1>

            <div>

                {/* LHS Keys for graph lines, cases */}
                <div className={style.keys}>

                    {/* Graph Lines */}
                    <div className={style.lines}>
                        <LegendLine color={color.first_dose} label={"One Dose"} />
                        <LegendLine color={color.final_dose} label={"Fully Vaccinated"} />
                        <LegendLine color={color.active_cases} label={"Daily New Cases"} />
                    </div>

                    {/* Case Shades */}
                    <div className={style.cases}>
                        <LegendCase level={"low"} label={"< 9 cases"} />
                        <LegendCase level={"medium"} label={"9 - 18 cases"} />
                        <LegendCase level={"high"} label={"18+ cases"} />
                    </div>
                </div>

                <div className={style.graph}>
                    <p>Daily Cases / 100,000</p>
                    <div>
                        <h3>Region</h3>
                        <LineChart height={225} width={325} data={example}>
                            <Tooltip />
                            <CartesianGrid strokeDasharray={"3 3"} stroke={"#ccc"}/>

                            <XAxis fontSize={12} dataKey={"date"} allowDuplicatedCategory={false}/>

                            {/* Active Cases*/}
                            <YAxis tickCount={6} domain={[0, 25]} allowDataOverflow={true} allowDecimals={false} fontSize={12} yAxisId={"L"} orientation={"left"}/>

                            {/* Daily New Cases+Deaths / 7 Day Average, Normalized to 100k */}
                            <Line
                                isAnimationActive={false}
                                yAxisId={"L"}
                                dataKey={"new_cases_deaths_normalized_100k_average"}
                                stroke={color.active_cases}
                            />


                            {/* Vaccine Administration - First Dose */}
                            <YAxis fontSize={12} yAxisId={"R"} orientation={"right"} domain={[0, 1]}/>
                            <Line
                                isAnimationActive={false}
                                yAxisId={"R"}
                                dataKey={"first_dose_population_cumulative"}
                                stroke={color.first_dose}
                            />

                            {/* Vaccine Administration - Second/Final Dose */}
                            <Line
                                isAnimationActive={false}
                                yAxisId={"R"}
                                dataKey={"final_dose_population_cumulative"}
                                stroke={color.final_dose}
                            />
                        </LineChart>
                    </div>
                    <p>Proportion Vaccinated</p>
                </div>
            </div>
        </div>
    )
}

export default Legend