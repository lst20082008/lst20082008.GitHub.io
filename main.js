const HelloVueApp = {
    data() {
        return {
            time: 0
        }
    },
    methods: {
        arriveTime() {
            this.time = "arrived!"
        },
        exitTime() {
            this.time = "exit!"
        }
    }
}
  
Vue.createApp(HelloVueApp).mount('#hello-vue')