import { Fragment } from "react";

// @ts-ignore
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { useMapContext } from "../util/context/provider";

import style from "../styles/Filter.module.scss"


/**
 * Basic Date-Picker using the 'react-datepicker' library
 * @param params Any parameters to provide the <ReactDatePicker /> component in addition to any defaults
 * @constructor
 */
const DatePicker = ({...params}) => {
    return (
        <ReactDatePicker
            {...params}
            todayButton={true}
        />
    )
}

/**
 * A Date range selector enabling the user to select a 'lower-bound' and 'upper-bound' of
 * dates with which to filter shown / displayed data
 * @constructor
 */
const Filter = () => {

    const context = useMapContext()

    return (<Fragment>

        {/* Change Size of the graphs */}
        <button className={style.button} onClick={() => context.toggleMini()}>Toggle Graph Size</button>

        {/* Date-filtering Module */}
        <div className={style.range}>

            {/* Lower-bound of date filtering */}
            <div>
                <div>
                    <p>Range Begin</p>
                    <DatePicker minDate={context.lowerValid} maxDate={context.dateUpper ?? context.upperValid} selected={context.dateLower} onChange={(date: Date) => context.setDateLower(date)} />
                </div>

            </div>

            {/* Flag graphs above a certain threshold */}
            <div>
                <p>Case Lower Threshold</p>
                <input type={"number"} value={context.lowerThreshold} onChange={e => context.setLowerThreshold(parseInt(e.target.value))}/>
            </div>

            {/* Set Y Max */}
            <div>
                <p>Max. Cases Shown / 100,000</p>
                <input type={"number"} value={context.ymax} step={25} min={0} onChange={e => context.setYmax(Math.max(parseInt(e.target.value), 0))}/>
            </div>

            {/* Flag graphs above a certain threshold */}
            <div>
                <p>Case Upper Threshold</p>
                <input type={"number"} value={context.upperThreshold} onChange={e => context.setUpperThreshold(parseInt(e.target.value))}/>
            </div>

            {/* Upper-bound of date filtering */}
            <div>
                <p>Range End</p>
                <DatePicker minDate={context.dateLower ?? context.lowerValid} maxDate={context.upperValid} selected={context.dateUpper} onChange={(date: Date) => context.setDateUpper(date)} />
            </div>
        </div>

    </Fragment>)
}

export default Filter