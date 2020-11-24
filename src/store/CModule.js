import axios from "axios"
export default {
  namespaced: true,
  state: {
    cart: {
      carts: [],
    },
  },
  actions: {
    getCart(context, ret) {
      context.commit('LOADING', true, { root: true })
      const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`
      axios.get(url).then((response) => {
        if(response.data.data.carts) {
          ret = response.data.data
          context.commit('CART', ret)
        }
        context.commit('LOADING', false, { root: true })
      })
    },
    addtoCart(context, { id, qty }) {
      const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`
      context.commit('LOADING', true, { root: true })
      const item = {
        product_id: id,
        qty,
      }
      context.commit('LOADING', true, { root: true })
      axios.post(url, { data: item }).then((response) => {
        context.commit('LOADING', false, { root: true })
        context.dispatch('getCart')
      })
    },
    removeCart(context, id) {
      const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart/${id}`
      context.commit('LOADING', true, { root: true })
      axios.delete(url).then((response) => {
        context.commit('LOADING', false, { root: true })
        context.dispatch("getCart")
      })
    }
  },
  mutations: {
    CART(state, ret) {
      state.cart = ret
    }
  },
  getters: {
    cart(state) {
      return state.cart
    }
  }
}