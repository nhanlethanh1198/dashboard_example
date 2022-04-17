import {action} from 'easy-peasy'

const location = {
    locations: [],
    setLocations: action((state, payload) => {
        state.locations = payload
    })
}

export default location