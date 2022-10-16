import request from '@/utils/request'

export default {
  //根据email发验证码
  sendCode(email) {
    return request({
      url: `/msm/signup/${email}`,
      method: 'get'
    })
  },

  //注册的方法
  registerMember(formItem) {
    return request({
      url: `/ucenter/register`,
      method: 'post',
      data: formItem
    })
  }

}