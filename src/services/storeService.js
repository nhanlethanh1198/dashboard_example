import {getStoreById, lockStoreById} from 'src/api/stores';

export const lockStoreById = async (id) => {
  const store = (await getStoreById(id)).data.data;
  if (!store) {
    throw new Error('Store not found');
  } else {
    return lockStoreById(id, !store.is_active).data;
  }
};
