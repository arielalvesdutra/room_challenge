export default interface CreateUserDTO {
  username: string
  password: string
  id?: number
  mobile_token?: string
  created_at?: Date
  updated_at?: Date
}
