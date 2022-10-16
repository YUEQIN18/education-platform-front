import request from '@/utils/request'

export function getList(params) {

  return request({
    url: '/table/list',
    method: 'get',
    params
  })

}

export default {
  getTeacherInfo(id) {
    return request({
      url: `/edu/teacher/get/${id}`,
      method: 'get',
    })
  },
  getTeacherListPage(current, limit, teacherQuery) {
    return request({
      url: `/edu/teacher/findListCondition/${current}/${limit}`,
      method: 'post',
      //teacherQuery条件对象， 转换成json传给后端
      data: teacherQuery
    })
  },
  addTeacher(teacher) {
    return request({
      url: `/edu/teacher/addTeacher`,
      method: 'post',
      data: teacher
    })
  },
  updateTeacher(teacher) {
    return request({
      url: `/edu/teacher/updateTeacher`,
      method: 'post',
      data: teacher
    })
  },
  deleteById(id) {
    return request({
      url: `/edu/teacher/${id}`,
      method: 'delete',
    })
  }
}
