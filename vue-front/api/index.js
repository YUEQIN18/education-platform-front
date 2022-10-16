import request from '@/utils/request'

export default {
  getIndexData() {
    return request({
      url: `/edu/front/index`,
      method: 'get'
    })
  }
}