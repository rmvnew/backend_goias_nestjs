import { Company } from "src/company/entities/company.entity";
import { Person } from "src/person/entities/person.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('PHONE')
export class Phone {

    @PrimaryGeneratedColumn()
    phone_id: number

    @Column()
    person_id: number

    @Column({ length: 15 })
    phone_number: string

    @Column({ name: 'is_active' })
    isActive: boolean

    @CreateDateColumn({ name: 'create_at' })
    createAt: string

    @UpdateDateColumn({ name: 'update_at' })
    updateAt: string

    @ManyToOne(() => Person, (person) => person.phones)
    @JoinColumn({ name: 'person_id' })
    person: Person

}
