import {CanadaRegions} from "../util/api_codes";
import {useMap} from "../util/map_interface";


const Postcard = ({ region }: { region: CanadaRegions }) => {

    const context = useMap();

    return (
        <div>
            <button onClick={() => context.toggleRegion(region)}>{region} {context.ShowRegions.has(region) ? "YOOO": "No"}</button>
        </div>
    )
}

const CanadaMap = () => {

    return (<>
        <Postcard region={CanadaRegions.YT} />
        <Postcard region={CanadaRegions.NT} />
        <Postcard region={CanadaRegions.NV} />

        <Postcard region={CanadaRegions.BC} />
        <Postcard region={CanadaRegions.AB} />
        <Postcard region={CanadaRegions.SK} />
        <Postcard region={CanadaRegions.MB} />
        <Postcard region={CanadaRegions.ON} />
        <Postcard region={CanadaRegions.QC} />
        <Postcard region={CanadaRegions.NL} />
        <Postcard region={CanadaRegions.NB} />
        <Postcard region={CanadaRegions.PE} />
        <Postcard region={CanadaRegions.NS} />
    </>)
}

export default CanadaMap