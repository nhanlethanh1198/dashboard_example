import { action } from 'easy-peasy'

const products = {
    categoriesForProduct: [],
    setCategoriesForProduct: action((state, payload) => {
        state.categoriesForProduct.push(payload)
    }),

    lockProduct: {},
    setLockProduct: action((state, payload) => {
        state.lockProduct = payload
    })
}

export default products