import request from '@/config/axios'
import type { TokenType } from '@/api/login/types'

/**
 * SSO Token 验证请求参数
 */
export interface VerifyTokenParams {
  token: string
}

/**
 * SSO 用户名密码登录请求参数
 */
export interface PasswordLoginParams {
  username: string
  password: string
}

/**
 * SSO Token 验证响应
 */
export interface VerifyTokenResponse extends TokenType {
  accessToken: string
  refreshToken: string
}

/**
 * SSO 密码登录响应
 */
export interface PasswordLoginResponse extends TokenType {
  accessToken: string
  refreshToken: string
}

/**
 * Mock: 验证 Token
 * @param token Token 字符串
 * @returns Token 信息
 */
export const verifyTicket = async (params): Promise<VerifyTokenResponse> => {
  // TODO: 替换为真实 API
   return await request.get({ url: '/system/auth/third-token-login', params})
  
  // Mock 实现
  // return new Promise((resolve, reject) => {
  //   setTimeout(() => {
  //     // Mock: 假设 token 以 'valid_' 开头为有效
  //     if (token && token.startsWith('valid_')) {
  //       resolve({
  //         accessToken: 'mock_access_token_' + Date.now(),
  //         refreshToken: 'mock_refresh_token_' + Date.now()
  //       })
  //     } else {
  //       reject(new Error('Token 无效或已过期'))
  //     }
  //   }, 1000) // 模拟网络延迟
  // })
}

/**
 * Mock: 使用用户名密码登录
 * @param params 登录参数
 * @returns Token 信息
 */
export const loginWithPassword = async (
  params: PasswordLoginParams
): Promise<PasswordLoginResponse> => {
  // TODO: 替换为真实 API
  // return request.post({ url: '/system/sso/login', data: params })
  
  // Mock 实现
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Mock: 假设用户名密码为 admin/123456 为有效
      if (params.username === 'admin' && params.password) {
        resolve({
          accessToken: 'mock_access_token_' + Date.now(),
          refreshToken: 'mock_refresh_token_' + Date.now()
        })
      } else {
        reject(new Error('用户名或密码错误'))
      }
    }, 1000) // 模拟网络延迟
  })
}

