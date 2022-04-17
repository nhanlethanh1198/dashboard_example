import { action } from 'easy-peasy'
const staff = {
  staffList: [],
  staffInfo: {},
  newStaff: {},
  lockStaff: {},
  setStaffList: action((state, payload) => {
    state.staffList = payload.slice().sort((a, b) => {
      if (a.created_at > b.created_at) return 1
      if (a.created_at < b.created_at) return -1
      return 0
    })
  }),
  setStaffInfo: action((state, payload) => {
    state.staffInfo = payload
  }),
  setNewStaff: action((state, payload) => {
    state.newStaff = payload
  }),
  setLockStaff: action((state, payload) => {
    state.lockStaff = payload
  })
}

export default staff
