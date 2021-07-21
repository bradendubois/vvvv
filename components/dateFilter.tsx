import { useMapContext } from "../util/map_interface";

// @ts-ignore
// TODO
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
const DateFilter = () => {

    const context = useMapContext()

    return (<>
        {/* Date-filtering Module */}
        <div className={style.range}>

            {/* Lower-bound of date filtering */}
            <div>
                <p>Range Begin</p>
                <DatePicker minDate={context.lowerValid} maxDate={context.dateUpper ?? context.upperValid} selected={context.dateLower} onChange={(date: Date) => context.setDateLower(date)} />
            </div>

            {/* Magic number 14: There are 10 provinces + 3 territories + 1 repatriated category comprising the data */}
            {/* context.dateLower?.getTime() !== context.dateUpper?.getTime() && <p>Range Size: <span>{context.COVIDData.length / 14} day(s)</span></p> */}

            {/* Upper-bound of date filtering */}
            <div>
                <p>Range End</p>
                <DatePicker minDate={context.dateLower ?? context.lowerValid} maxDate={context.upperValid} selected={context.dateUpper} onChange={(date: Date) => context.setDateUpper(date)} />
            </div>
        </div>
    </>)
}

export default DateFilter