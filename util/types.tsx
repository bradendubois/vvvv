
// One daily summary for one region in Canada
export type OpenCOVIDDaily = {

    active_cases: number
    active_cases_change: number
    date: String
    province: String
    testing_info: String,
    date_obj: Date  // A JS Date object created from 'date' to enable easier comparisons

    avaccine: number    // total vaccines administered (first & second doses included)
    cases: number
    cvaccine: number    // 'completed' vaccines (second doses, or any single-doses administered)
    deaths: number
    dvaccine: number    // vaccines distributed
    recovered: number
    testing: number
    cumulative_avaccine: number
    cumulative_cases: number
    cumulative_cvaccine: number
    cumulative_deaths: number
    cumulative_dvaccine: number
    cumulative_recovered: number
    cumulative_testing: number
}


// Type that both Canada and US data will be converted to
export type COVIDDaily = {

    country: String
    region: String
    date: Date
    date_string: string,

    active_cases: number
    cases: number
    cases_cumulative: number

    first_dose: number
    first_dose_cumulative: number

    final_dose: number
    final_dose_cumulative: number

    deaths: number
    deaths_cumulative: number
}

