import { action } from 'easy-peasy'

const dialog = {
    dialog: {},
    confirm: {},
    showDialog: false,
    setShowDialog: action((state, payload) => {
        state.showDialog = payload
    }),
    setDialog: action((state, payload) => {
        state.dialog = payload
    }),
    setConfirm: action((state, payload) => {
        state.confirm = payload
    })
}

export default dialog