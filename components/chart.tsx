import { useEffect, useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, ReferenceArea, Tooltip, XAxis, YAxis } from "recharts";
import { ScaleLoader } from "react-spinners";

import { color } from "../pages";
import { Country } from "../util/api_codes";
import { useMapContext } from "../util/context/provider";
import { COVIDDaily } from "../util/types";

import style from "../styles/Chart.module.scss"
import { DEBUG } from "../pages/_app";

type ChartProps = {
    country: Country
    code: string
    display?: string
    data: {
        match?: {
            startDate: Date
            rmse: number
        }
        data: COVIDDaily[]
    }
}


/**
 * A Chart built with 'recharts' LineChart component to visualize COVID information
 * @constructor
 */
const Chart = ({ country, code, display, data }: ChartProps) => {

    const context = useMapContext()

    const [refAreaLeft, setRefAreaLeft] = useState()
    const [refAreaRight, setRefAreaRight] = useState()

    const [searching, setSearching] = useState(false)

    const threshold = useMemo(() => {

        if (!data) return style.lowerThreshold

        let index = data.data.findIndex(x => x.date.getTime() == context.dateUpper.getTime())
        if (index == -1) {
            index = data.data.length - 1
        }

        let x = data.data[index]["Average Daily Case (Normalized)"]

        if (x >= context.upperThreshold) {
            return style.upperThreshold
        } else if (x >= context.lowerThreshold) {
            return style.middleThreshold
        } else {
            return style.lowerThreshold
        }
    }, [data, context.dateUpper, context.lowerThreshold, context.upperThreshold])

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

        l = new Date(l[2], l[1]-1, l[0], 0, 0, 0, 0)
        r = new Date(r[2], r[1]-1, r[0], 0, 0, 0, 0)

        if (l > r) {
            let temp = l
            l = r;
            r = temp
        }

        context.searchMatch(country, code, l, (r - l) / (24 * 60 * 60 * 1000) + 1)
    }

    useEffect(() => {

        if (!data || !data.match) return

        const str = (date: Date): string => {

            let day = date.getDate().toString()
            // if (day.length < 2) day = "0" + day

            let month = (date.getMonth() + 1).toString()
            // if (month.length < 2) month = "0" + month

            return `${day}-${month}-${date.getFullYear()}`
        }

        let upper = new Date(data.match.startDate.getTime())
        upper.setDate(data.match.startDate.getDate() + (context.match?.points ?? 0))

        // @ts-ignore
        setRefAreaLeft(str(data.match.startDate))
        // @ts-ignore
        setRefAreaRight(str(upper))

    }, [data?.match])

    useEffect(() => {
        console.log(code, refAreaLeft, refAreaRight)
    }, [refAreaRight])

    return (<div className={`${style.container} ${threshold}`}>

        <h4>{display ?? code}</h4>

        <hr />

        {/* During debugging, placeholder div to improve performance */}
        {(DEBUG || !data) && <div className={style.loader} style={{ 
            height: "225px", 
            width: "325px"
        }}>
            <ScaleLoader color={'#36D7B7'} />
        </div>}

        {!DEBUG && data &&

        <LineChart height={225} width={325} className={code} 
            data={data.data.filter(point => point.date >= context.dateLower && point.date <= context.dateUpper)}
            
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
                stroke={color.active_cases}
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
            {(refAreaLeft && refAreaRight) &&
                <ReferenceArea
                    yAxisId={"L"}
                    x1={refAreaLeft}
                    x2={refAreaRight}
                    strokeOpacity={0.3}
                />
            }

            <ReferenceArea
                yAxisId={"R"}
                x1={"29-01-2020"}
                x2={"31-01-2020"}
                strokeOpacity={0.3}
            />

        </LineChart>}
    </div>)
}

export default Chart
