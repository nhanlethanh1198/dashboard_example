import { instance, instanceFormData } from './instance'

const getStaffListAPI = async () => {
  return await instance.get(`staffs/get-list-staff`)
}

const getStaffInfoAPI = async (staff_id) => {
  return await instance.get(`staffs/get-staff/${staff_id}`)
}

const postNewStaffAPI = async (payload) => {
  return await instanceFormData.post('staffs/add-staff', payload)
}

const putStaffEditAPI = async (staff_id, payload) => {
  return await instanceFormData.put(
    `staffs/update-staff-info/${staff_id}`,
    payload
  )
}

const putStaffToLockAPI = async (staff_id, is_active) => {
  return await instance.put(`staffs/lock-unlock-staff/${staff_id}`, JSON.stringify({ is_active: !is_active }))
}

export { getStaffListAPI, getStaffInfoAPI, postNewStaffAPI, putStaffEditAPI, putStaffToLockAPI }
