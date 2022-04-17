import {action} from 'easy-peasy';

const cateogries = {
  categories: [],
  setListCategory: action((state, payload) => {
    // state.categories = payload?.slice().sort((a, b) => {
    //   if (a.created_at > b.created_at) return 1;
    //   if (a.created_at < b.created_at) return -1;
    //   return 0;
    // });
    state.categories = payload;
  }),
  category: {},
  setCategory: action((state, payload) => {
    state.category = payload;
  }),
  lockCategory: {},
  setLockCategory: action((state, payload) => {
    state.lockCategory = payload;
  }),
  updateCategory: {},
  setUpdateCategory: action((state, payload) => {
    state.updateCategory = payload;
  }),
};

export default cateogries;
