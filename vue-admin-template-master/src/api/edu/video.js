import request from '@/utils/request'

export default {

  // getAllChaptereVideo(courseId) {
  //   return request({
  //     url: `/edu/chapter/getChapterVideo/${courseId}`,
  //     method: 'get',
  //   })
  // },
  getVideo(id) {
    return request({
      url: `/edu/video/getVideo/${id}`,
      method: 'get',
    })
  },
  addVideo(video) {
    return request({
      url: `/edu/video/addVideo`,
      method: 'post',
      data: video
    })
  },
  updateVideo(video) {
    return request({
      url: `/edu/video/updateVideo`,
      method: 'post',
      data: video
    })
  },
  deleteVideo(id) {
    return request({
      url: `/edu/video/delete/${id}`,
      method: 'delete',
    })
  },
  deleteAliyunVod(id) {
    return request({
      url: `/vod/video/delete/${id}`,
      method: 'delete',
    })
  }
}
