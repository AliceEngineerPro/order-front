import axios from 'axios';
import router from '../router';
import Vue from 'vue';
import store from "@vue/cli-service/generator/vuex/template/src/store";

// 根据 NODE_ENV 来判断是否跨域
const service = axios.create({
    baseURL: process.env.NODE_ENV === 'production'? process.env.VUE_APP_SERVICE_URL: process.env.VUE_APP_SERVICE_AGENCY_URL,
    timeout: 1000 * 30,
})
service.defaults.headers["content-type"] = 'application/json';

service.interceptors.request.use( config => {
    let token =store.state.token;
    if(token){
        config.headers.Authorization = token;
    }
    return config;
}, error => {
    console.log(error);
    return Promise.reject();
})

service.interceptors.response.use(response => {
    if(response.status === 200){
        if(response.data && response.data.code === 401){//登录状态失效
            Vue.prototype.$message.error('登录状态失效，请重新登录');
            localStorage.removeItem('token');
            router.replace('/login');
            return response;
        }else if(response.data.status === 403){
            router.replace('/403');
            return response.data;
        }else{
            return response.data;
        }
    }else{
        Promise.reject();
    }
}, error => {
    console.log(error);
    return Promise.reject();
})



//默认其他请求格式
export default service;
//get
export function get(url,params={}){
    return new Promise((resolve,reject) => {
        service.get(url,{
            params:params
        }).then(response => {
            resolve(response);
        }).catch(err => {
            reject(err)
        })
    })
}
//post
export function post(url,data = {}){
    return new Promise((resolve,reject) => {
        service.post(url,data).then(response => {
            resolve(response);
        }).catch(err => {
            reject(err)
        })
    })
}
//pull
export function put(url,data = {}){
    return new Promise((resolve,reject) => {
        service.put(url,data).then(response => {
            resolve(response);
        }).catch(err => {
            reject(err)
        })
    })
}
//del
export function deleteRequest(url,params={}){
    return new Promise((resolve,reject) => {
        service.delete(url,{
            params:params
        }).then(response => {
            resolve(response);
        }).catch(err => {
            reject(err)
        })
    })
}
