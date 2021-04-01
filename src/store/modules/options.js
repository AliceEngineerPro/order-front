import request from "@/utils/request";
//导入axios

const state = {
    department:[],
    booking : []
};
const getters={};
//2.同步操作 把state的department同步成axios获取到的
const mutations = {
    settingOptions(state,args) {
    state.department=args;
    },
    setbook(state,args) {
        state.booking =args;
    }
};
//1.异步操作 通过axios获取通用的department
const actions = {
    //得到 通用属性
    getSetting({commit, dispatch, rootState},args) {
        request.get('/sys/department').then(result=>{
           this.commit('options/settingOptions',result)
            //console.log(result)
        })
    },
    booking({commit, dispatch, rootState},args) {
        request.get("/sys/booking").then(result=>{
            this.commit('options/setbook',result)
            console.log(result)
        })
    }
}

export default {
    namespaced:true,
    state,
    getters,
    mutations,
    actions
}
//做了这些只后 回到同级目录的index