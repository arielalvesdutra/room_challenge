// import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

// @Entity()
// export class User {

//   @PrimaryGeneratedColumn()
//   id: number | undefined;

//   @Column()
//   username: string | undefined;

//   @Column()
//   mobile_token:string | undefined;
// }

export interface User {
  id: number
  username: string
  password: string
  mobile_token?: string
  created_at?: Date
  updated_at?: Date
}
