import {instance, instanceFormData} from './instance';

const getBannerList = async (params) => await instance.get(`/banners/get-list-banner`, {params});

const getBannerById = async (id) => await instance.get(`/banners/get-banner-by-id/${id}`);

const postCreateBanner = async (data) =>
  await instanceFormData.post(`/banners/add-new-banner`, data);

const putBannerById = async (id, data) =>
  await instanceFormData.put(`/banners/update-banner/${id}`, data);

const deleteBannerById = async (id) => await instance.delete(`/banners/remove-banner/${id}`);

export {getBannerById, getBannerList, postCreateBanner, putBannerById, deleteBannerById};
