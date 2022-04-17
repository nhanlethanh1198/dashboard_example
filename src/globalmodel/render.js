import { action } from 'easy-peasy'

const render = {
    render: false,
    setRender: action((state, payload) => {
        state.render = payload
    })
}

export default render