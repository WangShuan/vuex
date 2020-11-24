import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

import PModule from "./PModule"
import CModule from "./CModule"
export default new Vuex.Store({
  strict: true,
  state: {
    isLoading: false,
  },
  actions: {
    updateLoading(context, status) {
      context.commit('LOADING', status)
    },
  },
  mutations: {
    LOADING(state, status) {
      state.isLoading = status
    }
  },
  modules: {
    PModule,
    CModule
  }
})