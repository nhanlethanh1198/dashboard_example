import {createStore} from 'easy-peasy';
import categories from './categories';
import snackbar from './snackbar';
import staff from './staff';
import dialog from './dialog';
import render from './render';
import products from './products';
import orders from './orders';
import user from './user';
import stores from './stores';
import location from './location'

const GlobalModel = {
  snackbar,
  orders,
  categories,
  staff,
  user,
  products,
  dialog,
  render,
  stores,
  location
};

const model = createStore(GlobalModel);

if (process.env.NODE_ENV === 'development') {
  if (module.hot) {
    module.hot.accept('./orders', () => {
      model.reconfigure(orders);
    });
    module.hot.accept('./categories', () => {
      model.reconfigure(categories);
    });
    module.hot.accept('./staff', () => {
      model.reconfigure(staff);
    });
    module.hot.accept('./user', () => {
      model.reconfigure(user);
    });
    module.hot.accept('./products', () => {
      model.reconfigure(products);
    });
    module.hot.accept('./dialog', () => {
      model.reconfigure(dialog);
    });
    module.hot.accept('./render', () => {
      model.reconfigure(render);
    });
    module.hot.accept('./stores', () => {
      model.reconfigure(stores);
    });
    module.hot.accept('./snackbar', () => {
      model.reconfigure(snackbar);
    });
    module.hot.accept('./location', () => {
      model.reconfigure(location)
    })
  }
}

export default model;
