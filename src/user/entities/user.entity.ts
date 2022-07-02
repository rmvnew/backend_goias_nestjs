import { Person } from "src/person/entities/person.entity";
import { ProfileEntity } from "src/profile/entities/profile.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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
    
    @Column()
    user_profile_id: number
    
    @ManyToOne(() => ProfileEntity, (profile) => profile.users)
    @JoinColumn({ name: 'user_profile_id' })
    profile: ProfileEntity


}
