import {createContextStore, action} from 'easy-peasy';

const OrderStore = createContextStore({
  loading: false,
  setLoading: action((state, payload) => (state.loading = payload)),

  // Add New Product to Order
  newProductInOrder: {},
  setNewProductInOrder: action((state, payload) => {
    state.newProductInOrder = payload;
  }),
});

export default OrderStore;
