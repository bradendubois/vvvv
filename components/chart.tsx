import { useEffect, useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, ReferenceArea, Tooltip, XAxis, YAxis } from "recharts";
import { ScaleLoader } from "react-spinners";

import { color } from "../pages";
import { Country } from "../util/api_codes";
import { useMapContext } from "../util/context/provider";

import style from "../styles/Chart.module.scss"
import { DEBUG } from "../pages/_app";

type ChartProps = {
    country: Country
    code: string
    display?: string
}




/**
 * A Chart built with 'recharts' LineChart component to visualize COVID information
 * @constructor
 */
const Chart = ({ country, code, display }: ChartProps) => {

    const context = useMapContext()

    const [refAreaLeft, setRefAreaLeft] = useState<string>()
    const [refAreaRight, setRefAreaRight] = useState<string>()

    const [searching, setSearching] = useState(false)

    const threshold = useMemo(() => {

        let data = (country === Country.Canada ? context.canadaData : context.americaData)?.[code]

        if (!data) return style.lowerThreshold

        let index = data.findIndex(x => x.date.getTime() == context.dateUpper.getTime())
        if (index == -1) {
            index = data.length - 1
        }

        let x = data[index]["Average Daily Case (Normalized)"]

        if (x >= context.upperThreshold) {
            return style.upperThreshold
        } else if (x >= context.lowerThreshold) {
            return style.middleThreshold
        } else {
            return style.lowerThreshold
        }
    }, [(country === Country.Canada ? context.canadaData : context.americaData), context.dateUpper, context.lowerThreshold, context.upperThreshold])

    const search = () => {

        setSearching(false)

        if (refAreaLeft === refAreaRight || !refAreaRight) {
            setRefAreaLeft(undefined)
            setRefAreaRight(undefined)
            return
        }

        // @ts-ignore
        let l = refAreaLeft.split("-")

        // @ts-ignore
        let r = refAreaRight.split("-")

        let l_date = new Date(parseInt(l[2]), parseInt(l[1])-1, parseInt(l[0]), 0, 0, 0, 0)
        let r_date = new Date(parseInt(r[2]), parseInt(r[1])-1, parseInt(r[0]), 0, 0, 0, 0)

        if (l_date > r_date) {
            let temp = l_date
            l_date = r_date;
            r_date = temp
        }

        context.searchMatch(country, code, l_date, (r_date.getTime() - l_date.getTime()) / (24 * 60 * 60 * 1000) + 1)
    }

    useEffect(() => {

        let dataset = (country === Country.Canada ? context.canadaMatches : context.americaMatches)

        let match = dataset?.[code]

        if (match === undefined) {
            setRefAreaLeft(undefined)
            setRefAreaRight(undefined)
            return
        }

        const str = (date: Date): string => {

            let day = date.getDate().toString()
            if (day.length < 2) day = "0" + day

            let month = (date.getMonth() + 1).toString()
            if (month.length < 2) month = "0" + month

            return `${day}-${month}-${date.getFullYear()}`
        }

        let upper = new Date(match.startDate.getTime())
        upper.setDate(match.startDate.getDate() + match.points)

        // @ts-ignore
        setRefAreaLeft(str(match.startDate))
        // @ts-ignore
        setRefAreaRight(str(upper))

    }, [country === Country.Canada ? context.canadaMatches : context.americaMatches])

    useEffect(() => {

        let matches = (country === Country.Canada ? context.canadaMatches : context.americaMatches)

        let match = matches?.[code]

        console.log(matches, match)

        if (!match) {
            setRefAreaLeft(undefined)
            setRefAreaRight(undefined)
            return
        }

        let lower = match.startDate

        let upper = new Date(lower.getTime())
        upper.setDate(upper.getDate() + match.points + 1)

        let l_str = `${lower.getDate()}-${lower.getMonth()+1}-${lower.getFullYear()}`
        let r_str = `${upper.getDate()}-${upper.getMonth()+1}-${upper.getFullYear()}`

        console.log(l_str, r_str, match.points)

        setRefAreaLeft(l_str)
        setRefAreaRight(r_str)

    }, [(country === Country.Canada ? context.canadaMatches : context.americaMatches)])

    const Graph = useMemo(() => {

        let data = (country === Country.Canada ? context.canadaData : context.americaData)?.[code]

        console.log(data)

        if (data === undefined || data.length === 0) return <div className={style.loader} style={{
            height: `${context.size.height}px`,
            width: `${context.size.width}px`
        }}>
            <ScaleLoader color={'#36D7B7'} />
        </div>

        return <LineChart height={context.size.height} width={context.size.width} className={code}

            data={data.filter(point => point.date >= context.dateLower && point.date <= context.dateUpper)}

            // Reference selection parameters
            onMouseDown={(e: any) => {
                setSearching(true)
                setRefAreaLeft(e.activeLabel)
                setRefAreaRight(undefined)
            }}

            onMouseMove={(e: any) => searching && refAreaLeft && setRefAreaRight(e.activeLabel)}
            onMouseUp={() => search()}
        >

            <Tooltip />
            <CartesianGrid strokeDasharray={"3 3"} stroke={"#ccc"}/>

            <XAxis fontSize={12} dataKey={"date_string"} allowDuplicatedCategory={false}/>

            {/* Daily Cases*/}
            <YAxis tickCount={6} domain={[0, 25]} allowDataOverflow={true} allowDecimals={false} fontSize={12} yAxisId={"L"} orientation={"left"}/>

            {/* Daily New Cases+Deaths / 7 Day Average, Normalized to 100k */}
            <Line
                isAnimationActive={false}
                yAxisId={"L"}
                dataKey={"Average Daily Case (Normalized)"}
                stroke={color.new_cases}
            />

            {/* Vaccine Administration - First Dose */}
            <YAxis fontSize={12} yAxisId={"R"} orientation={"right"} domain={[0, 1]}/>
            <Line
                isAnimationActive={false}
                yAxisId={"R"}
                dataKey={"First Dose Pop."}
                stroke={color.first_dose}
            />

            {/* Vaccine Administration - Second/Final Dose */}
            <Line
                isAnimationActive={false}
                yAxisId={"R"}
                dataKey={"Final Dose Pop."}
                stroke={color.final_dose}
            />

            {/* Reference Area selected by the user */}]
            {refAreaLeft && refAreaRight && <ReferenceArea
                yAxisId={"L"}
                x1={refAreaLeft}
                x2={refAreaRight}
                strokeOpacity={0.3}
            />}
        </LineChart>

    }, [context.dateLower, context.dateUpper, (country === Country.Canada ? context.canadaData : context.americaData), refAreaLeft, refAreaRight, context.size])

    return (<div className={`${style.container} ${threshold}`}>

        <h4>{display ?? code}</h4>

        <hr />

        {!DEBUG && Graph}
    </div>)
}

export default Chart
