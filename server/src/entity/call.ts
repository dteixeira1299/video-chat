import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Call {
  @PrimaryGeneratedColumn()
  id: number;
}
