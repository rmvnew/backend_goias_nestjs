import { Company } from "src/company/entities/company.entity";
import { Person } from "src/person/entities/person.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity('CLIENT')
export class Client {

    @PrimaryGeneratedColumn()
    client_id: number

    @Column({ name: 'is_active' })
    isActive: boolean

    @CreateDateColumn({ name: 'create_at' })
    createAt: string

    @UpdateDateColumn({ name: 'update_at' })
    updateAt: string

    @Column()
    person_id: number

    @OneToOne(() => Person, (person) => person.client)
    @JoinColumn({ name: 'person_id' })
    person: Person

    
}
