import { instance } from "./instance";

const getListUser = async (params) =>
  await instance.get(`users/get-list-user`, { params: params });

const getUserInfoById = async (id) =>
  await instance.get(`users/get-user-by-id/${id}`);

const postUserInfoById = async (id, payload) =>
  await instance.post(`users/update-info'/${id}`, payload);

const putLockUser = async (id, is_active) =>
  await instance.put(`users/lock-user/${id}`, { is_active: !is_active });

export { getListUser, getUserInfoById, postUserInfoById, putLockUser };
