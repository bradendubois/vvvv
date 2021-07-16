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

export const getCOVIDLabel = (str: String) => {
    switch (str) {
        case "Yukon":
            return CanadaRegions.YT
        case "Northwest Territories":
            return CanadaRegions.NT
        case "Nunavut":
            return CanadaRegions.NV
        case "British Columbia":
            return CanadaRegions.BC
        case "Alberta":
            return CanadaRegions.AB
        case "Saskatchewan":
            return CanadaRegions.SK
        case "Manitoba":
            return CanadaRegions.MB
        case "Ontario":
            return CanadaRegions.ON
        case "Quebec":
            return CanadaRegions.QC
        case "Newfoundland & Labrador":
            return CanadaRegions.NL
        case "Nova Scotia":
            return CanadaRegions.NS
        case "Prince Edward Island":
            return CanadaRegions.PE
        case "New Brunswick":
            return CanadaRegions.NB

        default:
            throw new Error("Invalid label!")
    }
}

export const OpenCOVIDLabel = (province: CanadaRegions | String) => {

    switch (province) {

        case CanadaRegions.BC:
            return "BC"
        case CanadaRegions.NL:
            return "NL"
        case CanadaRegions.NT:
            return "NWT"
        case CanadaRegions.PE:
            return "PEI"

        // String name is exactly as in dataset
        case CanadaRegions.YT:
        case CanadaRegions.AB:
        case CanadaRegions.MB:
        case CanadaRegions.NB:
        case CanadaRegions.NS:
        case CanadaRegions.NV:
        case CanadaRegions.ON:
        case CanadaRegions.QC:
        case CanadaRegions.SK:
            return province

        default:
            throw new Error(`Impossible / Invalid province: ${province}`)
    }
}