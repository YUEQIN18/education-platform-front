<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>
    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="发布"/>
    </el-steps>

    <el-button type="text" @click="openDialogForm()">添加章节</el-button>
    <!-- 添加和修改章节表单 -->
    <el-dialog :visible.sync="dialogChapterFormVisible" title="添加或修改章节">
        <el-form :model="chapter" label-width="120px">
            <el-form-item label="章节标题">
                <el-input v-model="chapter.title"/>
            </el-form-item>
            <el-form-item label="章节排序">
                <el-input-number v-model="chapter.sort" :min="0" controls-position="right"/>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
        </div>
    </el-dialog>
    <!-- 添加和修改小节表单 -->
    <el-dialog :visible.sync="dialogVideoFormVisible" title="添加小节">
      <el-form :model="video" label-width="120px">
        <el-form-item label="课时标题">
          <el-input v-model="video.title"/>
        </el-form-item>
        <el-form-item label="课时排序">
          <el-input-number v-model="video.sort" :min="0" controls-position="right"/>
        </el-form-item>
        <el-form-item label="是否免费">
          <el-radio-group v-model="video.isFree">
            <el-radio :label="1">免费</el-radio>
            <el-radio :label="0">收费</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上传视频">
          <el-upload
                :on-success="handleVodUploadSuccess"
                :on-remove="handleVodRemove"
                :before-remove="beforeVodRemove"
                :on-exceed="handleUploadExceed"
                :file-list="fileList"
                :action="BASE_API+'/vod/video/upload'"
                :limit="1"
                class="upload-demo">
          <el-button size="small" type="primary">上传视频</el-button>
          <el-tooltip placement="right-end">
              <div slot="content">最大支持1G<br>
                  支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br>
                  GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br>
                  MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br>
                  SWF、TS、VOB、WMV、WEBM 等视频格式上传</div>
              <i class="el-icon-question"/>
          </el-tooltip>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
        <el-button :disabled="saveVideoBtnDisabled" type="primary" @click="saveOrUpdateVideo">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 章节 -->
    <ul class="chanpterList">
        <li v-for="chapter in chapterVideoList" :key="chapter.id">
            <p>
              <span v-text='chapter.title'></span>
              <span class="acts">
                <el-button type="text" @click="openVideo(chapter.id)">添加小节</el-button>
                  <el-button type="text" @click="openEditChapter(chapter.id)">编辑</el-button>
                  <el-button type="text" @click="DeleteChapter(chapter.id)">删除</el-button>
              </span>
            </p>
            <!-- 视频 -->
            <ul class="chanpterList videoList">
                <li
                    v-for="video in chapter.children"
                    :key="video.id">
                    <p>{{ video.title }}
                        <span class="acts">
                            <el-button type="text" @click="openEditVideo(video.id)">编辑</el-button>
                            <el-button type="text" @click="deleteVideo(video.id)">删除</el-button>
                        </span>
                    </p>
                </li>
            </ul>
        </li>
    </ul>

    <div>
      <el-button @click="previous">上一步</el-button>
      <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
    </div>

  </div>
</template>
<script>
import chapter from '@/api/edu/chapter'
import video from '@/api/edu/video'
export default {
  data() {
    return {
      chapter: {
        id: '',
        title: '',
        courseId: '',
        sort: 0,
      },
      video: {// 课时对象
        id: '',
        title: '',
        sort: 0,
        isFree: 1,
        chapterId: '',
        courseId: '',
        videoSourceId: '',
        videoOriginalName: ''
      },
      chapterVideoList: [],
      courseId: '',
      fileList: [],//上传文件列表
      saveVideoBtnDisabled: false, // 保存按钮是否禁用
      saveBtnDisabled: false,
      dialogChapterFormVisible: false,
      dialogVideoFormVisible: false,
      BASE_API: process.env.BASE_API
    }
  },
  created() {
    //获取路由中的id
    if(this.$route.params && this.$route.params.id){
      this.courseId = this.$route.params.id
      this.getAllChaptereVideo()
    }
    
  },
  methods: {
    //===============小节===============
    //成功回调
    handleVodUploadSuccess(response, file, fileList) {
      this.video.videoSourceId = response.data.videoId
      this.video.videoOriginalName = file.name
    },
    //视图上传多于一个视频
    handleUploadExceed(files, fileList) {
      this.$message.warning('想要重新上传视频，请先删除已上传的视频')
    },
    beforeVodRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}?`)
    },
    handleVodRemove(file, fileList) {
      video.deleteAliyunVod(this.video.videoSourceId).then(response=>{
        this.$message({
          type: 'success',
          message: "删除视频成功"
        })
        //清空数据
        this.video.videoSourceId = ''
        this.video.videoOriginalName = ''
        this.fileList = []
      })
    },
    openVideo(chapterId){
      //清空
      this.video.title = ''
      this.video.sort = 0
      this.video.isFree = 0
      this.video.videoSourceId = ''
      this.dialogVideoFormVisible = true
      this.video.chapterId = chapterId

    },
    openEditVideo(videoId){
      this.getVideo(videoId)
      this.dialogVideoFormVisible = true
    },
    addVideo(){
      this.video.courseId = this.courseId
      video.addVideo(this.video)
        .then(response =>{
          this.dialogVideoFormVisible = false;
          this.$message({
          type: 'success',
          message: "添加小节成功"
          })
          //刷新章节
          this.getAllChaptereVideo()
        })
    },
    updateVideo(){
      this.video.courseId = this.courseId
      video.updateVideo(this.video)
        .then(response =>{
          this.dialogVideoFormVisible = false;
          this.$message({
          type: 'success',
          message: "修改小节成功"
          })
          //刷新章节
          this.getAllChaptereVideo()
        })
    },
    saveOrUpdateVideo(){
      if (!this.video.id) {
        this.addVideo()
      } else {
        this.updateVideo()
      }
    },
    getVideo(id){
      video.getVideo(id)
        .then(response =>{
          this.video = response.data.video
        })
    },
    deleteVideo(id){
      this.$confirm('此操作将永久删除该小节, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        video.deleteVideo(id)
          .then(response=>{
            this.$message({
                type: 'success',
                message: '删除成功!'
            })
            this.getAllChaptereVideo()
          })
      })
    },
    //===============章节===============
    addChapter(){
      this.chapter.courseId = this.courseId
      chapter.addChapter(this.chapter)
        .then(response =>{
          this.dialogChapterFormVisible = false;
          this.$message({
          type: 'success',
          message: "添加章节成功"
          })
          //刷新章节
          this.getAllChaptereVideo()
        })
    },
    updateChapter(){
      this.chapter.courseId = this.courseId
      chapter.updateChapter(this.chapter)
        .then(response =>{
          this.dialogChapterFormVisible = false;
          this.$message({
          type: 'success',
          message: "修改章节成功"
          })
          //刷新章节
          this.getAllChaptereVideo()
        })
    },
    saveOrUpdate(){
      //判断是添加还是修改？
      if(!this.chapter.id){
        this.addChapter()
      }else{
        this.updateChapter()
      }

    },
    openEditChapter(chapterId){
      this.dialogChapterFormVisible = true
      chapter.getChapter(chapterId)
        .then(response =>{
          this.chapter = response.data.chapter
        })
    },
    DeleteChapter(chapterId){
      this.$confirm('此操作将永久删除该章节, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        chapter.deleteChapter(chapterId)
          .then(response=>{
            this.$message({
                type: 'success',
                message: '删除成功!'
            })
            this.getAllChaptereVideo()
          })
      })
    },
    getAllChaptereVideo(){
      chapter.getAllChaptereVideo(this.courseId)
        .then(response =>{
          this.chapterVideoList = response.data.list;
        })
    },
    openDialogForm(){
      this.dialogChapterFormVisible = true
      this.chapter.title = ''
      this.chapter.sort = 0
    },
    previous() {
      console.log('previous')
      this.$router.push({ path: '/course/info/' + this.courseId })
    },
    next() {
      console.log('next')
      this.$router.push({ path: '/course/publish/' + this.courseId })
    }
  }
}
</script>

<style scoped>
.chanpterList{
    position: relative;
    list-style: none;
    margin: 0;
    padding: 0;
}
.chanpterList li{
  position: relative;
}
.chanpterList p{
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #DDD;
}
.chanpterList .acts {
    float: right;
    font-size: 14px;
}
.videoList{
  padding-left: 50px;
}
.videoList p{
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #DDD;
}
</style>