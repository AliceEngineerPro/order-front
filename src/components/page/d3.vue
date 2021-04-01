<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card shadow="hover" class="mgb20" style="height:252px;">
          <div class="user-info">
            <img src="../../assets/img/img.jpg" class="user-avator" alt/>
            <div class="user-info-cont">
              <div class="user-info-name">{{ name }}</div>
              <div>{{ role }}</div>
            </div>
          </div>
          <div>
            <p v-bind="getmes()">{{ mussess }}</p>
          </div>
        </el-card>
<!--        <div id="myechartssss" style="width: 1200px;height:400px;"></div>-->
      </el-col>
      <el-col :span="16">
        <el-row :gutter="20" class="mgb20">
          <el-col :span="6">
            <el-table
                :data="tableData"
                height="250"
                border
                style="width: 1200px">
              <el-table-column
                  prop="date"
                  label="日期"
                  width="180">
              </el-table-column>
              <el-table-column
                  prop="name"
                  label="姓名"
                  width="180">
              </el-table-column>
              <el-table-column
                  prop="address"
                  label="地址">
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <div class="byoder">
          <el-button class="order" type="button" @click="dialogFormVisible = true" >新增或取消</el-button>
          <el-button class="order2" type="button" @click="dialogFormexpart = true">数据导出</el-button>
        </div>
        <el-dialog title="新增取消或者预约用餐" :visible.sync="dialogFormVisible">
          <el-form :model="form" size="small">
            <el-form-item label="选择公司">
              <el-select v-model="form.departments" placeholder="请选择公司">
                <el-option v-for="item in options.department" :key="item.department_id" :label="item.department_name" :value="item.department_id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="选择名字">
              <el-select id="test" v-model="form.wx_id" placeholder="先选公司后选名字">
                <el-option v-for="item in names" :key="item.value" :label="item.name" :value="item.wx_id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="预约类型">
              <el-select v-model="form.is_delete" placeholder="请选择用餐类型">
                <el-option label="预约" :value="0"></el-option>
                <el-option label="取消" :value="-1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="用餐时间">
              <el-date-picker type="date" placeholder="选择日期" v-model="form.appointment_at" value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
            <el-form-item label="餐型">
              <el-checkbox-group v-model="form.meal_type">
                <el-checkbox :label="1">早餐</el-checkbox>
                <el-checkbox :label="2">中餐</el-checkbox>
                <el-checkbox :label="3">晚餐</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="oktheorder">确 定</el-button>
          </div>
        </el-dialog>
        <el-dialog title="导出数据" :visible.sync="dialogFormexpart">
          <el-form :model="expartdata" size="small">
            <el-form-item label="导出时间">
              <el-date-picker type="date" placeholder="选择日期" v-model="expartdata.getdate" value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormexpart = false">取 消</el-button>
            <el-button type="primary" @click="expart">确 定</el-button>
          </div>
        </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from "axios";
//import {mapState} from 'vuex';
import service from "@/utils/request";
import Vue from "vue";
import dateFormat from "@/utils/dateFormat";

export default {
  name: 'd3.vue',
  computed: {
    ...mapState(['common','options']),
    role() {
      return this.name === 'admin' ? '超级管理员' : '普通用户';

    }
  },
  watch: {//监听函数 监听select选择器公司是否选择了 选择了 那么 得到他的value 得到响应公司员工名字
    form:{
      deep:true,//开启深度监听
      handler:function(newValue) {
        var selectDepartmen = newValue.departments;
        this.get("/sys/wx",{'department':selectDepartmen}).then(res=> {
          this.names=res;
        })

      }
    },
  },
  data() {
    return {
      name: localStorage.getItem('ms_username'),
      loading: false,
      id:'',
      mussess: '',
      breakfast: '',
      lunch: '',
      dinner: '',
      department: [],
      names:[],
      list: [],
      tableData:  [{
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-08',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-06',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-07',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }],
      expartdata:[{
        getdate:'',
      }],
      form: {
        is_delete: '',
        wx_id:'',
        departments: '',
        appointment_at: '',
        meal_type: []
      },
      dialogTableVisible: false,
      dialogFormVisible: false,
      dialogFormexpart: false,
    }
  },

  created() {
  },
  mounted() {
    this.loadData();
  },
  methods: {
    getmes() {
      var newthis = this;
      axios.get("https://v1.hitokoto.cn").then(function (res) {
        if(newthis.mussess!=''){

        }else
          newthis.mussess = res.data.hitokoto;//每日一句话
      }), function (err) {
      }
    },
    loadData() {//加载表格数据
      this.loading = true;
      this.get('/order/order').then(res=>{
        let list=res;
        this.list=list;
        console.log(this.list)
      })
      this.drawLine();
      this.loading = false;

    },
    drawLines() {
      let that = this;
      var myChartssss = this.$echarts.init(document.getElementById("myechartssss"));
      myChartssss.setOption({
        title: {
          text: '今日各公司订餐数据',
          data: that.listdata,
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '50%',
            data: that.list,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      })
    },
    expart() {
      var exportdata = this.expartdata.getdate;
      var nowdate = new Date()
      var testdate=dateFormat("YYYY-mm-dd", nowdate)
      console.log(testdate)
      if(exportdata>testdate) {
        Vue.prototype.$message.error('时间选择错误 请检查时间');
        return;
      }else {
        this.get("/order/export", {'appointment_at': exportdata}).then(function (res) {
          if (code === 0) {
            Vue.prototype.$message("成功")
          } else {
            Vue.prototype.$message.error("失败")
          }
        }), function (err) {
          Vue.prototype.$message.error("导出失败请联系管理员")
        }
      }
      this.dialogFormVisible = false;
    },
    oktheorder() {
      service.post("/order/order",this.form).then(res=>{
        if (res.code === 0) {
          //alert("新增/删除成功！！！");
           this.$message.success(res.msg);
          this.show = false;
        } else {
          alert("请检查填写是否正确");
        }
      })
      this.dialogFormVisible = false;
    },
  },
}
</script>

<style scoped>
.order {
  text-align: center;
  font-size: 50px;
  color: white;
  box-shadow: 1px 0 1px rgba(255, 255, 255, .8) inset, 1px 0 1px rgba(51, 126, 66, .9);
  background: -webkit-linear-gradient(top, #64c878, #6dcb80);
  background: -moz-linear-gradient(top, #64c878, #6dcb80);
  background: linear-gradient(top, #64c878, #6dcb80);
}
.order2 {
  text-align: center;
  font-size: 50px;
  color: white;
  margin-left: 50px;
  box-shadow: 1px 0 1px rgba(255, 255, 255, .8) inset, 1px 0 1px rgba(51, 126, 66, .9);
  background: -webkit-linear-gradient(top, #64c878, #6dcb80);
  background: -moz-linear-gradient(top, #64c878, #6dcb80);
  background: linear-gradient(top, #64c878, #6dcb80);
}
.byoder{
  margin: 1px;
  padding-bottom: 25%;
  /*相当于盒子的高度*/
  width: 1200px;
  /*即维持宽高比为1:2*/
  height: 5px;
  text-align: center;
  font-size: 50px;
  color: white;
}

.demo-table-expand {
  font-size: 0;
}

.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}

.user-info {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 2px solid #ccc;
  margin-bottom: 20px;
}

.user-avator {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}

.user-info-cont {
  padding-left: 50px;
  flex: 1;
  font-size: 14px;
  color: #999;
}

.user-info-cont div:first-child {
  font-size: 30px;
  color: #222;
}

.user-info-list span {
  margin-left: 70px;
}

.mgb20 {
  margin-bottom: 50px;
}

</style>
