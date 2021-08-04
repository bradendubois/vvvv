const { PHASE_PRODUCTION_BUILD } = require('next/constants')

module.exports = (phase, { defaultConfig }) => {

    return {
        env: {
            production: phase === PHASE_PRODUCTION_BUILD
        }
    }
}
