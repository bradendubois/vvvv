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

export enum Country {
    Canada = "canada",
    America = "america"
}

export const canadaCodes: Codes = {

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
}

export const americaCodes = {
    "AL": "Alabama",
    "AK": "Alaska",
    "AR": "Arkansas",
    "AS": "American Samoa",
    "AZ": "Arizona",
    "CA": "California",
    "CT": "Connecticut",
    "CO": "Colorado",
    "DC": "District of Columbia",
    "DE": "Delaware",
    "FL": "Florida",
    "GA": "Georgia",
    "GU": "Guam",
    "HI": "Hawaii",
    "IA": "Iowa",
    "ID": "Idaho",
    "IN": "Indiana",
    "IL": "Illinois",
    "KS": "Kansas",
    "KY": "Kentucky",
    "LA": "Louisiana",
    "MA": "Massachusetts",
    "MD": "Maryland",
    "ME": "Maine",
    "MI": "Michigan",
    "MN": "Minnesota",
    "MO": "Missouri",
    "MP": "Northern Mariana IS",
    "MS": "Mississippi",
    "MT": "Montana",
    "NC": "North Carolina",
    "ND": "North Dakota",
    "NE": "Nebraska",
    "NH": "New Hampshire",
    "NJ": "New Jersey",
    "NM": "New Mexico",
    "NV": "Nevada",
    "NY": "New York",
    "OH": "Ohio",
    "OK": "Oklahoma",
    "OR": "Oregon",
    "PA": "Pennsylvania",
    "PR": "Puerto Rico",
    "RI": "Rhode Island",
    "SC": "South Carolina",
    "SD": "South Dakota",
    "TN": "Tennessee",
    "TX": "Texas",
    "UT": "Utah",
    "VA": "Virginia",
    "VI": "Virgin Islands",
    "VT": "Vermont",
    "WA": "Washington",
    "WI": "Wisconsin",
    "WV": "West Virginia",
    "WY": "Wyoming",

    /*
    "RP": "RP",
    "US": "US",
    "MH": "MH",
    "FM": "FM",
    "IH2": "IH2",
    "LTC": "LTC",
    "VA2": "VA2",
    "DD2": "DD2",
    "BP2": "BP2",
    */
}


export const canadaRegions: String[] = Array.from(Object.values(canadaCodes).map((x: any) => x.code))
export const americaRegions: String[] = Array.from(Object.values(americaCodes).map((x: any) => x.code))
