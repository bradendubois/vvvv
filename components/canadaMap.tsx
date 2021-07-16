import {CanadaRegions} from "../util/api_codes";
import {useMap} from "../util/map_interface";


import style from "../styles/CanadaMap.module.scss"

const Postcard = ({ region }: { region: CanadaRegions }) => {

    const context = useMap();

    return (
        <div className={region.replace(/\s/g,'')}>
            <button
                className={context.ShowRegions.has(region) ? style.enabled : style.disabled}
                onClick={() => context.toggleRegion(region)}>{region}
            </button>
        </div>
    )
}

const CanadaMap = () => {

    return (<div className={style.canada}>

        <h3>Territories</h3>
        <div>
            <Postcard region={CanadaRegions.YT} />
            <Postcard region={CanadaRegions.NT} />
            <Postcard region={CanadaRegions.NV} />
        </div>

        <h3>Provinces</h3>
        <div>
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
        </div>
    </div>)
}

export default CanadaMap