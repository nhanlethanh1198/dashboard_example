import { createContextStore, action } from 'easy-peasy'

const ProductStore = createContextStore({
    // Product List
    products: [],
    setProducts: action((state, payload) => {
        state.products = payload
    })
})

export default ProductStore