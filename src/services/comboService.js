export const addProductToCombo = (initProductList = [], product: []) => {
  let productList = [...initProductList];
  const addProduct = {
    id: productList.length + 1,
    ...product,
  };
  productList.push(addProduct);
  return productList;
};

export const removeProductFromCombo = (initProductList = [], productId) => {
  let productList = [...initProductList];
  const removeProduct = productList.filter((product) => product.id !== productId);
  return removeProduct;
};

export const changeProductCountInCombo = (initProductList = [], productId, product_count) => {
  let productList = [...initProductList];
  const changeProduct = productList.map((product) => {
    if (product.id === productId) {
      product.product_count = product_count;
      product.original_price = product.original_price * product_count;
      product.sale_price = product.sale_price * product_count;
    }
    return product;
  });
  return changeProduct;
};

export const calculateComboPrice = (initProductList = []) => {
  const productList = [...initProductList];
  const totalPrice = productList.reduce((total, product) => {
    return total + product.original_price;
  }, 0);

  const totalSalePrice = productList.reduce((total, product) => {
    return total + product.sale_price;
  }, 0);
  return {
    totalPrice,
    totalSalePrice,
  };
};
