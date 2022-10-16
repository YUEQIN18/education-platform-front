<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>
    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="发布"/>
    </el-steps>
  <el-form label-width="120px">
  <el-form-item label="课程标题">
    <el-input v-model="courseInfo.title" placeholder="示例：机器学习项目课：从基础到搭建项目视"/>
  </el-form-item>
  <!-- 所属分类 -->
  <el-form-item label="课程分类">
    <el-select
      v-model="courseInfo.subjectParentId"
      placeholder="一级分类" @change="subjectChanged">
      <el-option
        v-for="subjectParent in subjectParentList"
        :key="subjectParent.id"
        :label="subjectParent.title"
        :value="subjectParent.id"/>
    </el-select>
    <el-select
      v-model="courseInfo.subjectId"
      placeholder="二级分类">
      <el-option
        v-for="subject in subjectList"
        :key="subject.id"
        :label="subject.title"
        :value="subject.id"/>
    </el-select>
  </el-form-item>
  <!-- 课程讲师 -->
  <el-form-item label="课程讲师">
    <el-select
      v-model="courseInfo.teacherId"
      placeholder="请选择">
      <el-option
        v-for="teacher in teacherList"
        :key="teacher.id"
        :label="teacher.name"
        :value="teacher.id"/>
    </el-select>
  </el-form-item>
  <el-form-item label="总课时">
    <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="总课时数"/>
  </el-form-item>
  <el-form-item label="课程简介">
    <el-input v-model="courseInfo.description" placeholder=""/>
  </el-form-item>
  <!-- 课程封面  -->
  <el-form-item label="课程封面">
    <el-upload
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
      :action="BASE_API+'/oss/file/upload'"
      class="avatar-uploader">
      <img :src="courseInfo.cover" width="200px">
    </el-upload>
  </el-form-item>

  <el-form-item label="课程价格">
    <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="课程价格"/>
  </el-form-item>
  <div>
    <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存并下一步</el-button>
  </div>
</el-form>

  </div>
</template>
<script>
import course from '@/api/edu/course'
import subject from '@/api/edu/subject'
export default {
  data() {
    return {
      courseInfo: {
        title: '',
        subjectId: '', //二级分类
        subjectParentId: '', //一级分类
        teacherId: '',
        lessonNum: 0,
        description: '',
        cover: '/static/cover01.png',
        price: 0
      },
      courseId : '',
      teacherList: [],
      subjectParentList: [], //一级分类
      subjectList: [], //二级
      saveBtnDisabled: false, // 保存按钮是否禁用
      BASE_API: process.env.BASE_API
    }
  },
  created() {
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
      this.getAllTeacher()
      if(this.$route.params && this.$route.params.id){
        this.courseId = this.$route.params.id
        this.getCourseInfoById()
      } else{
        //清空
        this.courseInfo = {}
        this.courseId = ''
        this.teacherList = []
        this.subjectParentList = []
        this.subjectList = []
        this.getSubjectParent()
      }
    },
    //根据id查询信息
    getCourseInfoById(){
      course.getCourseInfo(this.courseId)
        .then(response =>{
          this.courseInfo = response.data.courseInfo
          //回显二级分类
          subject.getSubjectList()
            .then(response =>{
              this.subjectParentList = response.data.list
              for (let i = 0; i < this.subjectParentList.length; i++) {
                if (this.subjectParentList[i].id === this.courseInfo.subjectParentId) {
                    this.subjectList = this.subjectParentList[i].children
                }
              }
            })

        })
    },
    getSubjectParent(){
      subject.getSubjectList()
        .then(response => {
          this.subjectParentList = response.data.list
        })
    },
    //一级分类改变时，查询对应的二级分类
    subjectChanged(value){
      this.courseInfo.subjectId = ''
      //value 就是subject的id值
      for (let i = 0; i < this.subjectParentList.length; i++) {
        if (this.subjectParentList[i].id === value) {
            this.subjectList = this.subjectParentList[i].children
        }
      }
    },
    getAllTeacher(){
      course.getAllTeacher()
        .then(response =>{
          this.teacherList = response.data.items
        })
    },
    addCourse(){
      course.addCourseInfo(this.courseInfo)
        .then(response => {
          this.$message({
          type: 'success',
          message: "添加课程信息成功"
          })
          //跳转到第二步
          this.$router.push({ path: '/course/chapter/'+ response.data.CourseId })
        })
    },
    updateCourse(){
      course.updateCourseInfo(this.courseInfo)
        .then(response =>{
          this.$message({
          type: 'success',
          message: "修改课程信息成功"
          })
          //跳转到第二步
          this.$router.push({ path: '/course/chapter/'+ this.courseId })
        })
    },
    saveOrUpdate() {
      //判断是添加还是修改？
      if(!this.courseId){
        this.addCourse()
      }else{
        this.updateCourse()
      }
    },
    handleAvatarSuccess(res, file) {
      // console.log(URL.createObjectURL(file.raw))// base64编码
      this.courseInfo.cover = res.data.url
    },
    //检查文件类型
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>