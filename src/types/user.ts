export interface UserInfo {
  token: string
  iExpAT: number
  iExpRT: number
  userInfo: {
    fiUserId: number
    fsCognome: string
    fsNome: string
    fsMail: string
 
  }

}

export interface LoginResponse {
  status: string
  code: number
  message: string
  data: UserInfo
}
