import request from '@/utils/request'

export default {

  getAllChaptereVideo(courseId) {
    return request({
      url: `/edu/chapter/getChapterVideo/${courseId}`,
      method: 'get',
    })
  },
  getChapter(chapterId) {
    return request({
      url: `/edu/chapter/getChapterInfo/${chapterId}`,
      method: 'get',
    })
  },
  addChapter(chapter) {
    return request({
      url: `/edu/chapter/addChapter`,
      method: 'post',
      data: chapter
    })
  },
  updateChapter(chapter) {
    return request({
      url: `/edu/chapter/updateChapter`,
      method: 'post',
      data: chapter
    })
  },
  deleteChapter(chapterId) {
    return request({
      url: `/edu/chapter/delete/${chapterId}`,
      method: 'delete',
    })
  }
}
