// import { Entity, Column } from "typeorm";



// @Entity()
// export class Room {

//   @Column()
//   name: string | undefined
// }


export interface Room {
  name: string
  guid: string
  limit: number
}
