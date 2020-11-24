# VUEX

## 安裝

打開終端機輸入 `npm i --save vuex` 即可

## 結構說明

`Vuex` 是一個專為 `Vue` 開發的狀態管理模式 它可以集中存儲管理應用的所有組件的狀態 通常用於大型結構或網站的項目上

它的結構不同於 `vue` 但又類似於 `vue`

結構如下：

  - `state` 保存資料狀態用 類似於 `vue` 中的 `data`

  - `actions` 進行非同步的行為方法及獲取資料 類似於 `vue` 中的 `methods`

  - `getter` 資料呈現的方式 類似於 `vue` 中的元件

  - `mutation` 該變資料內容的方法 跟  `vue` 中的 `methods` 不同 在 `vuex` 中無法在獲取資料的同時做更改 需通過  `mutation` 才能更改資料狀態

    * 這裏建議把 `mutations` 的方法名統一使用全大寫取名 另外 `mutations` 通常名字會跟 `state` 取一樣的 差別在一個全大寫一個全小寫 較好辨認

## 使用

首先在項目中的 `src` 資料夾裡面增加一個資料夾 `store` 它是用來放彙整專用的檔案的 該檔案我們取為 `index.js`

打開 `index.js` 在裡面寫入以下代碼：

```js

import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

export default new Vuex.Store({})

```

接下來我們到項目中的 `main.js` 中引入 `store` 資料夾 引入方式同 `router` 一樣 先 `import` 然後在 `new Vue` 實例中加入 `store`

這樣就完成使用了

## 通過 Vuex 切換 isLoading 狀態

接下來打開 vuex 的 `index.js` 然後在 `Vuex.Store({})` 中添加結構

如下：

```js

export default new Vuex.Store({
  state: {
    isLoading: false
  },
  actions: {
    // 創建一個方法為 updateLoading 其中參數的 context 為 vuex 的參數，status 為自定義變量名稱
    updateLoading(context, status) {
      // 用 context.commit 方法切換資料狀態 參數1即 mutations 的方法
      context.commit('LOADING', status)
    }
  },
  mutations: {
    // 創建一個方法為 LOADING 其中參數的 state 為 vuex 的保存資料狀態那個 state 參數的 status 就是剛才上面 actions 的變量
    LOADING(state, status) {
      // 然後用傳進來的變量改變 isLoading 的值 如下
      state.isLoading = status
    }
  }
})

```

然後回到 `App.vue` 中 把 `data` 中的 `isLoading` 拿掉

找到每一個 `methods` 需要切換 `isLoading` 的地方 改寫為 

```js

// isLoading = true
vm.$store.dispatch("updateLoading", true); 
// isLoading = false
vm.$store.dispatch("updateLoading", false);

```

最後在 `export default{}` 裡添加上

```js

computed: {
  isLoading() {
    return this.$store.state.isLoading;
  },
},

```

即完成

## 嚴謹模式

在 vuex 中可以通過在 `state` 前面添加一行 `strict: true` 來讓 vuex 自動偵測語法上的錯誤 並在 `Console` 中給出警告

該模式是用來保證每次資料狀態的變更都可以被 `vue` 的開發者工具所偵測到

## 把 vue 改成 vuex

首先我們將原本在 vue 實例中的 `methods` 方法複製到 vuex 的 `index.js` 中

  * `methods` 方法複製到 `actions` 裡面

  * `methods` 更改 `data` 的地方複製到 `mutations` 裡面

  * `methods` 需要操作到的 `data` 則新增到 `state` 裡面

接下來給所有 `actions` 方法各自添加上 `context` `payload` 這兩個參數

把操作 `data` 的地方藉由 `context.commit()` 方法呼叫 `mutations` 對應的資料

如下：

```js

actions:{
  getProducts(context, payload) {
    const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/products/all`
    context.commit('LOADING', true)
    this.$http.get(url).then((response) => {
      console.log("取得產品列表:", response)
      payload = response.data.products
      context.commit('PRODUCTS', payload)
      context.commit('CATEGORIES', payload)
      context.commit('LOADING', false)
    })
  }
}

```

這裏要注意的是

* `this.$http` 原本是在實例中使用 `ajax` 的地方

在 `vuex` 中因為我們沒有引入 `axios` `vue-axios` 所以 `this.$http` 是找不到的

要解決該問題我們只需將 `axios` 引入到 `index.js` 中 並把 `this.$http` 改成 `axios` 即可

* 另外如果該方法需傳遞超過一個以上的參數則可用 `{}` 把多個參數包起來

接下來給所有 `mutations` 方法各自添加上 `state` `payload` 這兩個參數

通過 `state.xxx` 呼叫對應的資料 並賦值為傳進來的 `payload` 即可

如下：

```js

mutations: {
  PRODUCTS(state, payload) {
    state.products = payload
  },
  CATEGORIES(state, payload) {
    const categories = new Set()
    payload.forEach((item) => {
      categories.add(item.category)
    })
    state.categories = Array.from(categories)
  }
}

```

最後回到 vue 實例中 把原本的 `methods` 改成 `this.$store.dispatch('actions名稱')`

然後把 `data` 中的 `products` 與 `categories` 移除 並在 vue 的 `computed` 中添加以下代碼：

```js

computed:{
  products() {
    return this.$store.state.products;
  },
  categories() {
    return this.$store.state.categories;
  },
}

```

以上就是一個完整的修改範例了

## mapXXX 運用方法

之前提過在 `vuex`還有一個 `getters` 類似於 `vue` 中的 `computed`

它的使用方式如下：

```js

// vuex 的 index.js 檔
getters: {
  products(state) {
    return state.products
  },
  categories(state) {
    return state.categories
  },
}

// .vue 檔
import { mapGetters } from "vuex";

computed:{
  ...mapGetters(["products", "categories"]),
}

```

另外 在 `vuex` 中的其他結構也可以通過上述這種 `mapXXX` 方式來使用

但要注意的是 ***該方法不適用於需傳遞參數的地方***

若需要傳遞參數則還是要通過 `vm.$store.dispatch("方法名", 參數)` 才可以

## vuex 模組化

我們把範例檔案以購物車相關與商品相關拆分出兩個模塊 分別為 `PModule` 與 `CModule` 

首先在 `store` 資料夾內新增 `PModule.js` 與 `CModule.js` 然後在 `index.js` 的結構最下方添加一個屬性 `modules`

接下來把 `PModule.js` 與 `CModule.js` 引入到 `index.js` 中 將引入的名稱設為 `modules` 屬性的值

如下：

```js

export default new Vuex.Store({
  ...,
  modules: {
    PModule,
    CModule
  }
})

```

然後我們開啟 `PModule.js` 與 `CModule.js` 先引入 `axios` 接下來一樣寫入結構

範例如下：

```js

import axios from "axios"
export default {
  state:{},
  actions:{},
  mutations:{},
  getters:{}
}

```

把原本在 `index.js` 中有關購物車的部分全部改放到 `CModule.js` 中

把原本在 `index.js` 中有關商品的部分則全部改放到 `PModule.js` 中

接下來稍微說明一下模組中的結構問題：

* 在模組中的 `state` 是區域性的 即只在該模組中有被定義 若你在 `.vue` 檔中通過 `this.$store.state.xxx` 則無法獲取到模組中的 `state`

  - 若要在 `.vue` 檔中取得模組中的 `state` 屬性則改為：

  ```js
  
  vm.$store.state.PModule.products;
  
  ```

* 在模組中的其他結構是全域的 即在 `.vue` 檔中通過 `this.$store.dispatch("方法名")` 是可以的

* 想把模組中的所有結構統一改成區域性是可以的 只需在模組結構的第一行加上 `namespaced: true` 即可

  - 這樣做的好處是當你在 `index.js` 或其他模組檔案中有任一結構出現重複的名字時不會出錯

  - 這樣做以後在 `.vue` 中就不能直接通過 `this.$store.dispatch("方法名")` 調用方法了

    + 解決方法如下：

    ```js
    
    // 原本在 App.vue 中的獲取產品列表為 
    getProducts()
    // 在 index.js 中的獲取產品列表需於 .vue 檔中改為 
    this.$store.dispatch('getProducts')
    // 在 PModule.js 中的獲取產品列表需於 .vue 檔中改為 
    this.$store.dispatch('PModule/getProducts')
    
    ```

* 最後補充 `mapGetters` 與 `mapActions` 在模組化後的獲取方法：

```js

...mapGetters("PModule", ["products", "categories"]);
...mapActions("PModule", ["getProducts"]);

```