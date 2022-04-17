import { action } from 'easy-peasy'

const orders = {
    orderList: [],
    setOrderList: action((state, payload) => {
        state.orderList = [...payload]
    })
}

export default orders