import {instance, instanceFormData} from './instance';

const getListCategory = async () => await instance.get(`categories/get-list-category`);

const addCategoryAPI = async (payload) =>
  await instanceFormData.post(`categories/add-category`, payload);

const updateCategoryAPI = async (category_id, payload) =>
  await instanceFormData.put(`categories/update-category/${category_id}`, payload);

const handleLockCategoryAPI = async (category_id, is_active) =>
  await instance.put(
    `categories/lock-unlock-category/${category_id}`,
    JSON.stringify({is_active: !is_active})
  );

const getCategoryById = async (category_id) =>
  await instance.get(`categories/get-category-by-id/${category_id}`);

export {getListCategory, addCategoryAPI, updateCategoryAPI, handleLockCategoryAPI, getCategoryById};
