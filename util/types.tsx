
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


// Data from Socrata API on American vaccination data
export type SocrataVaccinationDaily = {
    admin_per_100k: string
    admin_per_100k_12plus: string
    admin_per_100k_18plus: string
    admin_per_100k_65plus: string
    administered: string
    administered_12plus: string
    administered_18plus: string
    administered_65plus: string
    administered_dose1_pop_pct: string
    administered_dose1_recip: string
    administered_dose1_recip_1: string
    administered_dose1_recip_2: string
    administered_dose1_recip_3: string
    administered_dose1_recip_4: string
    administered_dose1_recip_5: string
    administered_dose1_recip_6: string
    administered_fed_ltc: string
    administered_fed_ltc_dose1: string
    administered_fed_ltc_dose1_1: string
    administered_fed_ltc_dose1_2: string
    administered_fed_ltc_dose1_3: string
    administered_fed_ltc_residents: string
    administered_fed_ltc_staff: string
    administered_fed_ltc_unk: string
    administered_janssen: string
    administered_moderna: string
    administered_pfizer: string
    administered_unk_manuf: string
    date: Date
    dist_per_100k: string
    distributed: string
    distributed_janssen: string
    distributed_moderna: string
    distributed_per_100k_12plus: string
    distributed_per_100k_18plus: string
    distributed_per_100k_65plus: string
    distributed_pfizer: string
    distributed_unk_manuf: string
    location: string
    mmwr_week: string
    recip_administered: string
    series_complete_12plus: string
    series_complete_12pluspop: string
    series_complete_18plus: string
    series_complete_18pluspop: string
    series_complete_65plus: string
    series_complete_65pluspop: string
    series_complete_fedltc: string
    series_complete_fedltc_1: string
    series_complete_fedltc_staff: string
    series_complete_fedltc_unknown: string
    series_complete_janssen: string
    series_complete_janssen_12plus: string
    series_complete_janssen_18plus: string
    series_complete_janssen_65plus: string
    series_complete_moderna: string
    series_complete_moderna_12plus: string
    series_complete_moderna_18plus: string
    series_complete_moderna_65plus: string
    series_complete_pfizer: string
    series_complete_pfizer_12plus: string
    series_complete_pfizer_18plus: string
    series_complete_pfizer_65plus: string
    series_complete_pop_pct: string
    series_complete_unk_manuf: string
    series_complete_unk_manuf_1: string
    series_complete_unk_manuf_2: string
    series_complete_unk_manuf_3: string
    series_complete_yes: string
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

