import request from './request'

export function getGitCommits(limit = 10) {
  return request({
    url: '/git/commits',
    method: 'get',
    params: { limit },
  })
}
