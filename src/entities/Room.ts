export default interface Room {
  name: string
  guid: string
  limit: number
  id?:number
  created_at?: Date
  updated_at?: Date
}
