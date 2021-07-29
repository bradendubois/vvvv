import { useMapContext } from "../util/context/provider";

// @ts-ignore
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import style from "../styles/DateFilter.module.scss"


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

    return (<>
        {/* Date-filtering Module */}
        <div className={style.range}>

            {/* Lower-bound of date filtering */}
            <div>
                <p>Range Begin</p>
                <DatePicker minDate={context.lowerValid} maxDate={context.dateUpper ?? context.upperValid} selected={context.dateLower} onChange={(date: Date) => context.setDateLower(date)} />
            </div>

            {/* Flag graphs above a certain threshold */}
            <div>
                <p>Case Threshold</p>
                <input type={"number"} value={context.upperThreshold} onChange={e => context.setThreshold(parseInt(e.target.value))}/>
            </div>

            {/* Upper-bound of date filtering */}
            <div>
                <p>Range End</p>
                <DatePicker minDate={context.dateLower ?? context.lowerValid} maxDate={context.upperValid} selected={context.dateUpper} onChange={(date: Date) => context.setDateUpper(date)} />
            </div>
        </div>
    </>)
}

export default Filter