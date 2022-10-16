<template>
  <div class="app-container">
    添加讲师
    <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name"/>
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" controls-position="right" min="0"/>
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <!--
            数据类型一定要和取出的json中的一致，否则没法回填
            因此，这里value使用动态绑定的值，保证其数据类型是number
          -->
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>

      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career"/>
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea"/>
      </el-form-item>
      <!-- 讲师头像 -->
      <el-form-item label="讲师头像">
        <!-- 头衔缩略图 -->
        <pan-thumb :image="teacher.avatar"/>
        <!-- 文件上传按钮 -->
        <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">更换头像
        </el-button>
        <!--
        v-show：是否显示上传组件
        :key：类似于id，如果一个页面多个图片上传控件，可以做区分
        :url：后台上传的url地址
        @close：关闭上传组件
        @crop-upload-success：上传成功后的回调 -->
        <image-cropper
                  v-show="imagecropperShow"
                  :width="300"
                  :height="300"
                  :key="imagecropperKey"
                  :url="BASE_API+'/oss/file/upload'"
                  field="file"
                  @close="close"
                  @crop-upload-success="cropSuccess"/>
      </el-form-item>
      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate()">保存</el-button>
      </el-form-item>
    </el-form>
  </div>

</template>

<script>
import teacherApi from '@/api/edu/teacher'
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'

export default {
  components: { ImageCropper, PanThumb },
  data() {
    return {
      teacher: {
        name: '',
        sort: '',
        level: '',
        career: '',
        intro: '',
        avatar: ''
      },
      BASE_API: process.env.BASE_API,
      imagecropperShow: false,
      imagecropperKey: 0,
      saveBtnDisabled: false
    }
  },
  created(){
    this.init()
  },
  watch: {
    //监听路由地址变化，一旦变化方法就会执行
    $route(to, from) {
      this.init()
    }
  },
  methods: {
    init(){
      if (this.$route.params && this.$route.params.id) {
        const id = this.$route.params.id
        this.getInfo(id)
      }else{
        //清空表单
        this.teacher = {}
      }
    },
    close(){
      this.imagecropperShow=false
      this.imagecropperKey = this.imagecropperKey + 1
    },
    //上传成功
    cropSuccess(data){
      this.imagecropperShow=false
      this.imagecropperKey = this.imagecropperKey + 1
      this.teacher.avatar = data.url
    },
    getInfo(id){
      teacherApi.getTeacherInfo(id)
        .then(response=>{
          this.teacher = response.data.item
        })
    },
    saveOrUpdate(){
      if(!this.teacher.id){
        //添加
        this.saveTeacher()
      }else{
        //修改
        this.updateTeacher()
      }
    },
    saveTeacher(){
      teacherApi.addTeacher(this.teacher)
        .then(response=>{
            this.$message({
              type: 'success',
              message: '添加成功!'
            })
            this.$router.push({path:'/teacher/table'})
        })
    },
    updateTeacher(){
      teacherApi.updateTeacher(this.teacher)
        .then(response=>{
          this.$message({
              type: 'success',
              message: '修改成功!'
            })
          this.$router.push({path:'/teacher/table'})
        })
    }
  }

}
</script>