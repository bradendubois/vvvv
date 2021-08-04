const { PHASE_PRODUCTION_BUILD } = require('next/constants')
const currentGitBranchName = require("current-git-branch")

module.exports = (phase, { defaultConfig }) => {

    return {
        env: {
            production: currentGitBranchName() === 'main'
        }
    }
}
