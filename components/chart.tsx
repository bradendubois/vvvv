import { useEffect, useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, ReferenceArea, Tooltip, XAxis, YAxis } from "recharts";
import { ScaleLoader } from "react-spinners";

import { color } from "../pages";
import { Country } from "../util/api_codes";
import { useMapContext } from "../util/context/provider";

import style from "../styles/Chart.module.scss"

/// Props for one Chart
type ChartProps = {
    country: Country    // Canada/America
    code: string        // Unique code identifying the region in the dataset
    display?: string    // Optional display value to place above the graph
}


/**
 * A Chart built with 'recharts' LineChart component to visualize COVID information
 * @constructor
 */
const Chart = ({ country, code, display }: ChartProps) => {

    const context = useMapContext()

    // Data sources for the lines and highlighted region of the graph
    const data = country === Country.Canada ? context.canadaData : context.americaData
    const matches = country === Country.Canada ? context.canadaMatches : context.americaMatches

    // Selected left / right regions for the graph
    const [refAreaLeft, setRefAreaLeft] = useState<string>()
    const [refAreaRight, setRefAreaRight] = useState<string>()

    // Whether or not mouse movement over a graph 'sets' an edge to select a region
    const [scanning, setScanning] = useState(false)

    /// Hook to update the left/right selected region of the graph
    useEffect(() => {

        let match = matches?.[code]

        // No match ; clear
        if (match === undefined) {
            setRefAreaLeft(undefined)
            setRefAreaRight(undefined)
            return
        }

        let lower = match.startDate

        let upper = new Date(lower.getTime())
        upper.setDate(upper.getDate() + match.points + 1)

        setRefAreaLeft(`${lower.getDate()}-${lower.getMonth()+1}-${lower.getFullYear()}`)
        setRefAreaRight(`${upper.getDate()}-${upper.getMonth()+1}-${upper.getFullYear()}`)

    }, [matches])

    /// Initiate a search for the selected region
    const search = () => {

        setScanning(false)

        // A 'click' can reset / clear
        if (refAreaLeft === refAreaRight || refAreaLeft === undefined || refAreaRight === undefined) {
            context.clearMatches()
            return
        }

        let l = refAreaLeft.split("-")
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

    /// Filter data points to the selected range
    const Data = useMemo(() => {
        return data?.[code]?.filter(point => point.date >= context.dateLower && point.date <= context.dateUpper)
    }, [data, code, context.dateLower, context.dateUpper])

    /// Compute what style / color of threshold should be provided based on available / selected data
    const Threshold = useMemo(() => {

        let points = data?.[code]

        if (!points) return style.lowerThreshold

        let index = points.findIndex(x => x.date.getTime() == context.dateUpper.getTime())
        if (index == -1) {
            index = points.length - 1
        }

        let x = points[index]["Average Daily Case (Normalized)"]

        if (x >= context.upperThreshold) {
            return style.upperThreshold
        } else if (x >= context.lowerThreshold) {
            return style.middleThreshold
        } else {
            return style.lowerThreshold
        }
    }, [data, code, context.dateUpper, context.lowerThreshold, context.upperThreshold])

    /// The Graph / visualization, with a Loader as a fallback if data is not yet ready
    const Graph = useMemo(() => {

        let points = data?.[code]

        // Fallback to a Loader if no data is found
        if (points === undefined || points.length === 0) return <div className={style.loader} style={{
            height: `${context.size.height}px`,
            width: `${context.size.width}px`
        }}>
            <ScaleLoader color={'#36D7B7'} />
        </div>

        return <LineChart className={code}

            // Size of graph - can be larger / smaller based on a toggle
            height={context.size.height}
            width={context.size.width}

            data={Data} // Data the graph will use to draw lines

            // Reference selection parameters
            onMouseDown={(e: any) => {
                setScanning(true)
                setRefAreaLeft(e.activeLabel)
                setRefAreaRight(undefined)
            }}
            onMouseMove={(e: any) => scanning && refAreaLeft && setRefAreaRight(e.activeLabel)}
            onMouseUp={() => search()}
        >

            <Tooltip />
            <CartesianGrid strokeDasharray={"3 3"} stroke={"#ccc"}/>

            <XAxis fontSize={12} dataKey={"date_string"} allowDuplicatedCategory={false}/>

            {/* Daily New Cases / 7 Day Average, Normalized to 100k */}
            <YAxis tickCount={6} domain={[0, 25]} allowDataOverflow={true} allowDecimals={false} fontSize={12} yAxisId={"L"} orientation={"left"}/>
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

    }, [data, code, context.dateLower, context.dateUpper, refAreaLeft, refAreaRight, context.size])

    return (<div className={`${style.container} ${Threshold}`}>

        <h4>{display ?? code}</h4>

        <hr />

        {Graph}
    </div>)
}

export default Chart
