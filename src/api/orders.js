import {instance} from './instance';

const getListOrder = (params) => {
  return instance.get('orders/get-list-order', {params: {...params}});
};

const getOrderById = (id) => {
  return instance.get(`orders/get-order-by-id/${id}`);
};

const putEditOrderProduct = (order_id, data) => {
  return instance.put(`orders/update-order/${order_id}`, data);
};

export {getListOrder, getOrderById, putEditOrderProduct};
