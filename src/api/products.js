import {instance, instanceFormData} from './instance';

const postNewProduct = async (payload) => {
  return await instanceFormData.post(`products/add-product`, payload);
};

const getProductsWithParams = (params) => {
  return instance.get(`products/get-list-product`, {params: {...params}});
};

const getProductByCode = (code) => {
  return instance.get(`products/get-product-by-code/${code}`);
};

const putProductForUpdate = (code, payload) => {
  return instanceFormData.put(`products/update-product/${code}`, payload);
};

const putProductStatusToLock = (code, payload) => {
  return instance.put(`products/update-status-product/${code}`, JSON.stringify({status: payload}));
};

const getProductSale = async () => await instance.get('products/get-product-sale');

const getProductByType = async (type) =>
  await instance.get(`products/get-product-trend`, {params: {filter: type}});

const syncProductSale = async () => await instance.post(`products/sync-product-sale`);

const updateProductSale = async (data, type) => {
  const link = {
    sale: 'products/update-position-product-sale',
    trend: 'products/update-position-product-trend',
    arrival: 'products/update-position-product-arrival',
    'high-rate': 'products/update-position-product-high-rate',
  };
  return await instance.put(link[type], data);
};

export {
  postNewProduct,
  getProductsWithParams,
  getProductByCode,
  putProductForUpdate,
  putProductStatusToLock,
  getProductSale,
  getProductByType,
  syncProductSale,
  updateProductSale,
};
