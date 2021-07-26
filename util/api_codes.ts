export enum CanadaRegions {
    YT = "Yukon",
    NT = "NWT",
    NV = "Nunavut",

    BC = "BC",
    AB = "Alberta",
    SK = "Saskatchewan",
    MB = "Manitoba",
    ON = "Ontario",
    QC = "Quebec",
    NL = "NL",
    NS = "Nova Scotia",
    PE = "PEI",
    NB = "New Brunswick"
}


export const CanadaCodes = [
    "YT",
    "NT",
    "NV",
    "BC",
    "AB",
    "SK",
    "MB",
    "ON",
    "QC",
    "NL",
    "NS",
    "PE",
    "NB"
]

type Codes = {
    [region: string]: {
        code: string,
        display?: string
    }
}

export const codes: Codes = {

    "Yukon": {
        code: "YT",
        display: "Yukon",
    },

    "NWT": {
        code: "NT",
        display: "Northwest Territories"
    },

    "Nunavut": {
        code: "NU",
        display: "Nunavut"
    },

    "BC": {
        code: "BC",
        display: "British Columbia"
    },

    "Alberta": {
        code: "AB",
        display: "Alberta"
    },

    "Saskatchewan": {
        code: "SK",
        display: "Saskatchewan"
    },

    "Manitoba": {
        code: "MB",
        display: "Manitoba"
    },

    "Ontario": {
        code: "ON",
        display: "Ontario"
    },

    "Quebec": {
        code: "QC",
        display: "Quebec"
    },

    "NL": {
        code: "NL",
        display: "Newfoundland & Labrador"
    },

    "Nova Scotia": {
        code: "NS",
        display:" Nova Scotia"
    },

    "PEI": {
        code: "PE",
        display: "Prince Edward Island"
    },

    "New Brunswick": {
        code: "NB",
        display: "New Brunswick"
    },

    "Repatriated": {
        code: "RP"
    },

    "FM": { code: "FM" },
    "TX": { code: "TX" },
    "SD": { code: "SD" },
    "RI": { code: "RI" },
    "VI": { code: "VI" },
    "MI": { code: "MI" },
    "TN": { code: "TN" },
    "OR": { code: "OR" },
    "IL": { code: "IL" },
    "AL": { code: "AL" },
    "DD2": { code: "DD2" },
    "VA": { code: "VA" },
    "MT": { code: "MT" },
    "MO": { code: "MO" },
    "NV": { code: "NV" },
    "WA": { code: "WA" },
    "DE": { code: "DE" },
    "IH2": { code: "IH2" },
    "OH": { code: "OH" },
    "ND": { code: "ND" },
    "NJ": { code: "NJ" },
    "GU": { code: "GU" },
    "UT": { code: "UT" },
    "WV": { code: "WV" },
    "FL": { code: "FL" },
    "IA": { code: "IA" },
    "CO": { code: "CO" },
    "NY": { code: "NY" },
    "ID": { code: "ID" },
    "SC": { code: "SC" },
    "BP2": { code: "BP2" },
    "DC": { code: "DC" },
    "MN": { code: "MN" },
    "PA": { code: "PA" },
    "LA": { code: "LA" },
    "NE": { code: "NE" },
    "WY": { code: "WY" },
    "CT": { code: "CT" },
    "VT": { code: "VT" },
    "KY": { code: "KY" },
    "IN": { code: "IN" },
    "GA": { code: "GA" },
    "US": { code: "US" },
    "PR": { code: "PR" },
    "MS": { code: "MS" },
    "AK": { code: "AK" },
    "MH": { code: "MH" },
    "NC": { code: "NC" },
    "MA": { code: "MA" },
    "VA2": { code: "VA2" },
    "OK": { code: "OK" },
    "MD": { code: "MD" },
    "ME": { code: "ME" },
    "MP": { code: "MP" },
    "AZ": { code: "AZ" },
    "KS": { code: "KS" },
    "RP": { code: "RP" },
    "CA": { code: "CA" },
    "LTC": { code: "LTC" },
    "AS": { code: "AS" },
    "NH": { code: "NH" },
    "AR": { code: "AR" },
    "HI": { code: "HI" },
    "NM": { code: "NM" },
    "WI": { code: "WI" },
}

export const regions: String[] = Array.from(Object.values(codes).map((x: any) => x.code))
