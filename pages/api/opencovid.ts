import { NextApiRequest, NextApiResponse } from 'next'
import { DailyReport } from "../../util/map_interface";

export default (req: NextApiRequest, res: NextApiResponse) => {

    let today = new Date()

    fetch(`https://api.opencovid.ca/summary?after=1-1-2020&before=${today.getDate()}-${today.getMonth()+1}-${today.getFullYear()}`)
        .then(response => response.json())
        .then(response => res.status(200).json(response.summary))
}