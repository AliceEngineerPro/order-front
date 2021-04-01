<template>
    <div class="wrapper">
        <v-head></v-head>
<!--        <v-sidebar></v-sidebar>-->
        <div class="content-box" :class="{'content-collapse':collapse}">
            <v-tags></v-tags>
            <div class="content">
                <transition name="move" mode="out-in">
                    <keep-alive :include="tagsList">
                        <router-view></router-view>
                    </keep-alive>
                </transition>
                <el-backtop target=".content"></el-backtop>
            </div>
        </div>
    </div>
</template>

<script>
import vHead from './Header.vue';
import vSidebar from './Sidebar.vue';
import vTags from './Tags.vue';
import bus from './bus';
import service from "@/utils/request";
import {mapState} from 'vuex';

export default {
  computed:{
    ...mapState(['common','options'])
  },
    data() {
        return {
            tagsList: [],
            collapse: false
        };
    },
    components: {
        vHead,
        vSidebar,
        vTags
    },
    created() {
    let that = this;
      this.$store.commit('thisInit',this);
      // token
      let token = localStorage.getItem('token');
      if(token){// 如果存在token，添加header并初始化用户信息
        service.defaults.headers["token"] = token;
        that.$store.dispatch('options/getSetting');
      } else {
        return;
      }

    }
};
</script>
