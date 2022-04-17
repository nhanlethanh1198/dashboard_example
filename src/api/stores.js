import {instance, instanceFormData} from './instance';

const getStoreList = async (params) =>
  await instance.get(`/stores/get-list-store`, {params: {...params}});

const getStoreById = async (id) => await instance.get(`/stores/get-store-by-id/${id}`);

const createStore = async (data) => await instanceFormData.post(`/stores/add-new-store`, data);

const updateStoreById = async (id, data) =>
  await instanceFormData.put(`/stores/update-store/${id}`, data);

const lockStoreById = async (id, is_active) =>
  await instance.put(`/stores/lock-store/${id}`, {is_active: !is_active});

const getStoreListActive = async () => await instance.get(`/stores/get-list-store-active`);

export {
  getStoreList,
  getStoreById,
  createStore,
  updateStoreById,
  lockStoreById,
  getStoreListActive,
};
