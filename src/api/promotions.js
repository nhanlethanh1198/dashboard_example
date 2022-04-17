import {instance, instanceFormData} from './instance';

const getAllPromotions = async () => instance.get(`/promotions`);
const getPromotionById = async (id) => instance.get(`/promotions/get-by-id/${id}`);
const postNewPromotion = async (data) =>
  instanceFormData.post(`/promotions/create-promotion`, data);
const putUpdatePromotion = async (id, data) =>
  instanceFormData.put(`/promotions/update-promotion/${id}`, data);

export {getAllPromotions, getPromotionById, postNewPromotion, putUpdatePromotion};
