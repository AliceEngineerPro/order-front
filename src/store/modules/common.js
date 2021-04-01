import axios from 'axios';
import request from "@/utils/request";
const state={
    _this:[],
}
const getters={}
const mutations={
    thisInit(state, args) {
        state._this = args;
    },
}
const actions={
    exportExcel({commit, dispatch, rootState}, forms) {

        // 清除为空的参数
        let url = forms.url;
        let params = forms.params ? forms.params : {};
        const loading = state._this.$loading({
            lock: true,
            text: '正在准备数据，请稍候',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
        });
        // 下载文件
        axios({
            method: 'POST',
            url: (process.env.NODE_ENV === 'production' ? process.env.VUE_APP_SERVICE_URL : process.env.VUE_APP_SERVICE_AGENCY_URL) + url,
            data: params,
            responseType: 'blob',
        }).then(result => {
            if (result.headers['content-disposition']) {
                // 创建DOM修改文件名
                let a = document.createElement("a");
                // 从content-disposition截取文件名
                a.download = decodeURIComponent(result.headers['content-disposition'].slice(20));
                // 将blob转换为本地文件
                let blob = new Blob([result.data], {type: "application/vnd.ms-excel"});
                a.href = window.URL.createObjectURL(blob);
                // 点击下载
                a.click();
                state._this.$message.success('导出成功');

            } else {
                request.post(url,params).then(res=>{
                    if (res.code === -1){
                        state._this.$message.error(res.msg);
                    } else {
                        state._this.$message.error('导出失败');
                    }
                }).catch(e=>{
                    state._this.$message.error('导出失败');
                })
            }
            loading.close();
        }).catch(e => {
            console.log(e);
            state._this.$message.error('导出异常');
            loading.close();
        })
    },
}
export default {
    namespaced: false,
    state,
    getters,
    mutations,
    actions
}