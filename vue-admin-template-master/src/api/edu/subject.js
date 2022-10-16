import request from '@/utils/request'

export default {

  getSubjectList(current, limit, teacherQuery) {
    return request({
      url: `/edu/subject/getAll`,
      method: 'get',
    })
  }
}
