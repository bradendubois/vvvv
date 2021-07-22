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
    }
}

export const regions: String[] = Array.from(Object.values(codes).map((x: any) => x.code))

console.log(regions)