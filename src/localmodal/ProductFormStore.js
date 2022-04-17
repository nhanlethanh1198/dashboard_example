import {createContextStore, action} from 'easy-peasy';

const initProductPrice = [
  {
    id: 1,
    weight: 1,
    unit: 'kg',
    price: 80000,
    price_sale: 50000,
    stock: 20,
  },
  {
    id: 2,
    weight: 1,
    unit: 'kg',
    price: 80000,
    price_sale: 50000,
    stock: 20,
  },
];

const ProductFormStore = createContextStore({
  loading: false,
  setLoading: action((state, payload) => {
    state.loading = payload;
  }),
  //Create New Product Store
  productPrice: initProductPrice,
  setProductPrice: action((state, payload) => {
    state.productPrice = payload;
  }),
  productPriceDefault: 1,
  setProductPriceDefault: action((state, payload) => {
    state.productPriceDefault = Number(payload);
  }),
  // Set Product Category List
  categoryList: [],
  setCategoryList: action((state, payload) => {
    state.categoryList = payload;
  }),

  // Edit Product Store
  editProduct: {},
  setEditProduct: action((state, payload) => {
    state.editProduct = payload;
  }),
});

export default ProductFormStore;
