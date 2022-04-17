import {action} from 'easy-peasy';

const stores = {
  lockStore: {
    id: null,
    is_active: null,
  },
  setLockStore: action((state, payload) => {
    state.lockStore = payload;
  }),
  storeListActive: [],
  setStoreListActive: action((state, payload) => {
    state.storeListActive = payload;
  }),
};

export default stores;
