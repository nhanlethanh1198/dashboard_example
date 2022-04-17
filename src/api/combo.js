import {instanceFormData, instance, instanceApplication} from './instance';

const getListCombo = async () => await instance.get(`combo/get-combo-list`);

const getComboById = async (id) => await instance.get(`combo/get-combo-by-id/${id}`);

const createNewCombo = async (data) => await instanceFormData.post(`combo/create-combo`, data);

const updateComboById = async (id, data) =>
  await instanceFormData.put(`combo/update-combo-by-id/${id}`, data);

const setActiveComboById = async (id, is_active) => {
  const params = new URLSearchParams();
  params.append('is_active', is_active);
  return await instanceApplication.put(`combo/active-combo/${id}`, params);
};

export {getListCombo, getComboById, createNewCombo, updateComboById, setActiveComboById};
