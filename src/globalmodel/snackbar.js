import { action } from 'easy-peasy'
const initSnackbar = {
  snackbarOpen: false,
  snackbarType: 'success',
  snackbarMessage: '',
}

const snackbar = {
  snackbar: initSnackbar,
  showSnackbar: false,
  setSnackbar: action((state, payload) => {
    state.snackbar = payload
  }),
  setShowSnackbar: action((state, payload) => {
    state.showSnackbar = payload
  })
}

export default snackbar
