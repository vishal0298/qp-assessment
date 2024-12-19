import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    email: string

    @Column()
    password: string

    @Column({ type: 'varchar', length: 15 })  
    phone: string;

    @Column()
    age: number
    
    @Column({
        default: 'user'
    })
    role: string


}
