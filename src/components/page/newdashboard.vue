<template>

  <el-row :gutter="20">
    <el-col :span="8"><div class="grid-content bg-purple"></div>
      <div class="f1css">
        <div id="echarts" :style="{width: '500px', height: '500px'}"></div>
      </div>
    </el-col>

    <el-col :span="16"><div class="grid-content bg-purple"></div>
      <div style="white-space:nowrap; margin-bottom:30px">
        <el-select v-model="form.departments" placeholder="请选择公司">
          <el-option v-for="item in options.department" :key="item.department_id" :label="item.department_name" :value="item.department_id"></el-option>
        </el-select>
        <el-select id="test" v-model="form.wx_id" placeholder="先选公司后选名字">
          <el-option v-for="item in names" :key="item.value" :label="item.name" :value="item.wx_id"></el-option>
        </el-select>
        <span class="demonstration"></span>
        <el-date-picker
            v-model="datevalue"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions">
        </el-date-picker>
        <el-button @click="selectall()">查询</el-button>
        <el-button class="order2" type="button" @click="dialogFormexpart = true">数据导出</el-button>
        <el-dialog title="新增预约用餐" :visible.sync="dialogFormVisible">
        </el-dialog>
        <el-dialog title="导出数据" :visible.sync="dialogFormexpart">
          <el-form v-model="expartdata" size="small">
            <el-form-item label="导出时间">
              <el-date-picker type="date" placeholder="选择日期" v-model="expartdata.getdate"  value-format="yyyy-MM-dd" :picker-options="pickerOptions"></el-date-picker>
            </el-form-item>
            <el-button @click="expart('/order/export',{'meal_types':[1],'appointment_at':expartdata.getdate})">导出当日早餐</el-button>
            <el-button @click="expart('/order/export',{'meal_types':[2],'appointment_at':expartdata.getdate})">导出当日中餐</el-button>
            <el-button @click="expart('/order/export',{'meal_types':[3],'appointment_at':expartdata.getdate})">导出当日晚餐</el-button>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormexpart = false">取 消</el-button>
            <el-button type="primary" @click="dialogFormexpart = false">确 定</el-button>
          </div>
        </el-dialog>
      </div>
      <template>
        <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            border
            style="width: 100%"
            @selection-change="handleSelectionChange"
            v-loading="loading"
        >
          <el-table-column
              type="selection"
              width="55">
          </el-table-column>
          <el-table-column
              prop="appointment_at"
              label="日期"
              width="120">
          </el-table-column>
          <el-table-column
              prop="name"
              label="姓名"
              width="120">
          </el-table-column>
          <el-table-column
              prop="department"
              label="公司"
              show-overflow-tooltip>
          </el-table-column>
          <el-table-column
              prop="meal_type"
              label="早餐"
              show-overflow-tooltip
              style="cursor:pointer;"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.order[0]">
                <i class="el-icon-check" @click="cancelmealsone(scope.row.order[0])" style="color: green;font-size: 20px"></i><!--icon小图标-->
              </span>
              <span v-else><i class="el-icon-close" @click="bookamealbreak(scope.row.wx_id,scope.row.appointment_at)" style="color: red;font-size: 20px"></i> </span>
            </template>
          </el-table-column>
          <el-table-column
              prop="meal_type"
              label="午餐"
              show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.order[1]" > <i class="el-icon-check" @click="cancelmealstwo(scope.row.order[1])" style="color: green;font-size: 20px"></i></span>
              <span v-else><i class="el-icon-close" @click="bookameallunch(scope.row.wx_id,scope.row.appointment_at)" style="color: red;font-size: 20px"></i>
                </span>
            </template>
          </el-table-column>
          <el-table-column
              prop="meal_type"
              label="晚餐"
              show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.order[2]"> <i class="el-icon-check" @click="cancelmealstrr(scope.row.order[2])" style="color: green;font-size: 20px"></i></span>
              <span v-else><i class="el-icon-close" @click="bookamealdinner(scope.row.wx_id,scope.row.appointment_at)" style="color: red;font-size: 20px"></i> </span>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-col>
  </el-row>



</template>

<script>
import {mapState} from "vuex";
import dateFormat from "@/utils/dateFormat";
import Vue from "vue";
import service from "@/utils/request";
import common from "@/store/modules/common";

export default {
  name: "newdashboard.vue",
  watch: {//监听函数 监听select选择器公司是否选择了 选择了 那么 得到他的value 得到响应公司员工名字
    form:{
      deep:true,//开启深度监听
      handler:function(newValue) {

        if(this.nede != newValue.departments) {
          this.form.wx_id = null
          //根据员工的wx_id去查询当日用餐情况
          this.get("/sys/wx", {'department': newValue.departments}).then(res => {
            this.names = res;
            this.nede = newValue.departments;

          });
        }
      }
    },
  },
  computed: {
    ...mapState(['common','options']),
  },
  data() {
    return {
      names:[],
      nede:null,
      datevalue:'',
      list: [],
      test01:'',
      typesss:[],//修改状态信息
      loading: false,
      meal_types:'',
      pickerOptions: {
        // 限制查询时间
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      form: {
        wx_id:'',
        departments: '',
        appointment_at: '',
        meal_type: []
      },
      expartdata:[{
        getdate:'',
      }],
      tableData: [{
        appointment_at: '',
        wx_id: '',
        name: '',
        department: '',
        order:[],
      },
      ],
      multipleSelection: [],
      dialogFormexpart: false,
      dialogFormVisible: false,
    }
  },
  created() {
    this.datevalue=dateFormat("YYYY-mm-dd",new Date())
    this.loadData();
    this.selectall();
    this.test();
  },
  mounted() {

  },
  methods: {
    test () {
      this.get("/sys/booking",{appointment_at:this.datevalue}).then(res=>{
        this.typesss=res;
      })
    },
    cancelmealsone(mealtypeId) {
      //取消早餐
      if(this.typesss[0] == 0 ) {
        //如果 为0 谁都可以修改
        service.patch("/order/order",{
          'id':mealtypeId
        }).then(res => {
          //得到新的res 然后刷新表格
          if(res.code === 0 ) {
            this.$message.success(res.msg);
            this.loadData();
            this.selectall();
          }
          //this.tableData=res;
        })
        console.log(this.typesss[0])
      }else if (this.typesss[0] == 1) {
        service.patch("/order/order",{
          'id':mealtypeId
        }).then(res => {
          //得到新的res 然后刷新表格
          if(res.code === 0 ) {
            this.$message.success(res.msg);
            this.loadData();
            this.selectall();
          }
          //this.tableData=res;
        })
        alert("当日数据已经导出 请重新导出数据！！");
      }else if(this.typesss[0] == 2) {
        alert("最晚修改时间已过 不允许修改了！！！");
      }
    },
    cancelmealstwo(mealtypeId) {
      if(this.typesss[1] == 0 ) {
        //如果 为0 谁都可以修改
        service.patch("/order/order",{
          'id':mealtypeId
        }).then(res => {
          //得到新的res 然后刷新表格
          if(res.code === 0 ) {
            this.$message.success(res.msg);
            this.loadData();
            this.selectall();
          }
          //this.tableData=res;
        })
        console.log(this.typesss[0])
      }else if (this.typesss[1] == 1) {
        service.patch("/order/order",{
          'id':mealtypeId
        }).then(res => {
          if(res.code === 0 ) {
            this.$message.success(res.msg);
            this.loadData();
            this.selectall();
          }
          //this.tableData=res;
        })
        alert("当日数据已经导出 请重新导出数据！！");
      }else if(this.typesss[1] == 2) {
        alert("最晚修改时间已过 不允许修改了！！！");
      }
    },
    cancelmealstrr(mealtypeId) {
      if(this.typesss[2] == 0 ) {
        //如果 为0 谁都可以修改
        service.patch("/order/order",{
          'id':mealtypeId
        }).then(res => {
          //得到新的res 然后刷新表格
          if(res.code === 0 ) {
            this.$message.success(res.msg);
            this.loadData();
            this.selectall();
          }
          //this.tableData=res;
        })
        console.log(this.typesss[0])
      }else if (this.typesss[2] == 1) {
        service.patch("/order/order",{
          'id':mealtypeId
        }).then(res => {
          //得到新的res 然后刷新表格
          if(res.code === 0 ) {
            this.$message.success(res.msg);
            this.loadData();
            this.selectall();
          }

        })
        alert("当日数据已经导出 请重新导出数据！！");
      }else if(this.typesss[2] == 2) {
        alert("最晚修改时间已过 不允许修改了！！！");
      }
    },
    bookamealbreak(wx_ids,appointment_at) {
      //新增早餐
      if(this.typesss[0] == 0 ) {
        //如果 为0 谁都可以修改
        service.post("/order/order",{
          'wx_id':wx_ids,
          'appointment_at':appointment_at,
          'meal_type' : 1,
        }).then(res => {
          this.$message.success(res.msg);
          this.loadData();
          this.selectall();
        })
        console.log(this.typesss[0])
      }else if (this.typesss[0] == 1) {
        service.post("/order/order",{
          'id':mealtypeId
        }).then(res => {
          if(res.code === 0 ) {
            this.$message.success(res.msg);
            this.loadData();
            this.selectall();
          }
        })
        alert("当日数据已经导出 请检查 数据完整性");
      }else if(this.typesss[0] == 2) {
        alert("最晚修改时间已过 不允许修改了！！！");
      }

    },
    bookameallunch(wx_ids,appointment_at) {
      //新增午餐
      if(this.typesss[1] == 0 ) {
        //如果 为0 谁都可以修改
        service.post("/order/order",{
          'wx_id':wx_ids,
          'appointment_at':appointment_at,
          'meal_type' : 2,
        }).then(res => {
          this.$message.success(res.msg);
          this.loadData();
          this.selectall();
          //this.tableData=res;
          //得到新的res 然后刷新表格
        })
      }else if (this.typesss[1] == 1) {
        service.post("/order/order",{
          'wx_id':wx_ids,
          'appointment_at':appointment_at,
          'meal_type' : 2,
        }).then(res => {
          this.$message.success(res.msg);
          this.loadData();
          this.selectall();
          //this.tableData=res;
          //得到新的res 然后刷新表格
        })
        alert("当日数据已经导出 请检查 数据完整性");
      }else if(this.typesss[1] == 2) {
        alert("最晚修改时间已过 不允许修改了！！！");
      }
    },
    bookamealdinner(wx_ids,appointment_at) {
      //新增晚餐
      if(this.typesss[2] == 0 ) {
        //如果 为0 谁都可以修改
        service.post("/order/order",{
          'wx_id':wx_ids,
          'appointment_at':appointment_at,
          'meal_type' : 3,
        }).then(res => {
          this.$message.success(res.msg);
          this.loadData();
          this.selectall();
          //this.tableData=res;
          //得到新的res 然后刷新表格
        })
      }else if (this.typesss[2] == 1) {
        service.post("/order/order",{
          'wx_id':wx_ids,
          'appointment_at':appointment_at,
          'meal_type' : 3,
        }).then(res => {
          this.$message.success(res.msg);
          this.loadData();
          this.selectall();
        })
        //this.tableData=res;
        alert("当日数据已经导出 请检查 数据完整性");
      }else if(this.typesss[2] == 2) {
        alert("最晚修改时间已过 不允许修改了！！！");
        return
      }
    },
    selectall() {
      this.test();
      let params = {
        'appointment_at':this.datevalue
      }
      if(this.form.wx_id) {
        params.wx_id = this.form.wx_id
      } else
      if (this.form.departments) {
        params.department = this.form.departments
      }
      this.loading = true

      this.get("/order/order",params).then(res => {
        console.log(res)
        this.loading = false
        this.tableData = res.data;
        if (code === 0){
          this.$message.success(res.msg);
        }else {
          this.$message.error(err);
        }
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    expart(url,params) {
      console.log(url)
      //导出
      this.$store.dispatch('exportExcel', {url:url, params:params});
      this.dialogFormVisible = false;
    },
    loadData() {
      let that = this;
      this.get("/order/total").then(res=>{
        let lists = res;
        this.list=lists;
        this.drawLine();
      })

    },
    drawLine() {
      var dom = document.getElementById('echarts')
      var myChart = this.$echarts.init(dom)
      myChart.setOption({
        title: {
          text: '各个分公司当日数据',
          left: 'center',
        },
        tooltip: {
          trigger: 'item'
        },
        series: [
          {
            name: '今日总数',
            type: 'pie',
            radius: '50%',
            data: this.list,
            //[{value:1,name:'自控维护分公司'}],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      });
    },
  }
}
</script>

<style scoped>
.el-row {
  margin-bottom: 20px;
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {

}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px ;
  background-color: #f9fafc;
}
</style>