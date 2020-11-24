import axios from "axios"
export default {
  namespaced: true,
  state: {
    products: [],
    categories: [],
    filterProducts: [],
  },
  actions: {
    getProducts(context, ret) {
      const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/products/all`
      context.commit('LOADING', true, { root: true })
      axios.get(url).then((response) => {
        ret = response.data.products
        context.commit('PRODUCTS', ret)
        context.commit('CATEGORIES', ret)
        context.commit('LOADING', false, { root: true })
      })
    },
    filterP(context, text) {
      const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/products/all`
      axios.get(url).then((response) => {
        if(text) {
          const arr = response.data.products
          let arr2 = arr.filter((item) => {
            return item.title.indexOf(text) !== -1
          })
          context.commit('FILTERPRODUCTS', arr2)
        }
      })
    }
  },
  mutations: {
    PRODUCTS(state, ret) {
      state.products = ret
    },
    CATEGORIES(state, ret) {
      const categories = new Set()
      ret.forEach((item) => {
        categories.add(item.category)
      })
      state.categories = Array.from(categories)
    },
    FILTERPRODUCTS(state, ret) {
      state.filterProducts = ret
    }
  },
  getters: {
    products(state) {
      return state.products
    },
    categories(state) {
      return state.categories
    },
    filterProducts(state) {
      return state.filterProducts
    }
  },
}