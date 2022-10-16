import request from '@/utils/request'

export default {

  addCourseInfo(courseInfo) {
    return request({
      url: `/edu/course/addCourseInfo`,
      method: 'post',
      data: courseInfo
    })
  },
  getAllTeacher() {
    return request({
      url: `/edu/teacher/findAll`,
      method: 'get',
    })
  },
  getCourseInfo(id) {
    return request({
      url: `/edu/course/getCourseInfo/${id}`,
      method: 'get'
    })
  },
  getPublishCourseInfo(id) {
    return request({
      url: `/edu/course/getPublishCourseInfo/${id}`,
      method: 'get'
    })
  },
  getAllCourse() {
    return request({
      url: `/edu/course/getAllCourse`,
      method: 'get'
    })
  },
  updateCourseInfo(courseInfo) {
    return request({
      url: `/edu/course/updateCourseInfo`,
      method: 'post',
      data: courseInfo
    })
  },
  publishCourse(id) {
    return request({
      url: `/edu/course/publishCourse/${id}`,
      method: 'post',
    })
  },
  deleteById(id) {
    return request({
      url: `/edu/course/delete/${id}`,
      method: 'delete',
    })
  }
}
