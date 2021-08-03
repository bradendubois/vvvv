// Lower-bound: Jan 1 2020
const pandemic_lower = new Date()
pandemic_lower.setFullYear(2020, 0, 1)

// Upper-bound: Current date
const present = new Date();

// Lower-start: 3 months ago
// const three_months_ago = new Date();
// three_months_ago.setFullYear(present.getFullYear(), present.getMonth() - 3, present.getDate())

const year_start = new Date();
year_start.setFullYear(2021, 0, 1)

// Clear the 'time' to fix comparisons on the same day, as time is set when the Date object is created
pandemic_lower.setHours(0, 0, 0, 0)
// three_months_ago.setHours(0, 0, 0, 0)
year_start.setHours(0, 0, 0, 0)
present.setHours(0, 0, 0, 0)


export const dates = {
    lower: {
        start: year_start,
        limit: pandemic_lower
    },
    upper: {
        start: present,
        limit: present
    }
}
