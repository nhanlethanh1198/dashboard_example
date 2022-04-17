import {instance} from './instance';

export const getDistricts = async ({...params}) =>
  await instance.get(`/location/province`, {params: {...params}});

export const getProvinces = async () => await instance.get(`/location/province`);