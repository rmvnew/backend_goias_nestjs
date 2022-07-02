import { Person } from "src/person/entities/person.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('USER')
export class User {


    @PrimaryGeneratedColumn()
    user_id: number

    @Column()
    user_login: string

    @Column()
    user_password: string

    @Column()
    first_access: boolean

    @Column({ nullable: true })
    refresh_token: string

    @Column({ name: 'is_active' })
    isActive: boolean

    @CreateDateColumn({ name: 'create_at' })
    createAt: Date

    @UpdateDateColumn({ name: 'update_at' })
    updateAt: Date

    @Column()
    person_id: number

    @OneToOne(() => Person, (person) => person.user)
    @JoinColumn({ name: 'person_id' })
    person: Person


}
