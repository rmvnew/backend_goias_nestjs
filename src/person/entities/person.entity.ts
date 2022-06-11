import { Address } from "src/address/entities/address.entity";
import { Phone } from "src/phone/entities/phone.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('PERSON')
export class Person {

    @PrimaryGeneratedColumn()
    person_id: number

    @Column()
    person_name: string

    @Column()
    address_id: number

    @Column({ name: 'is_active' })
    isActive: boolean

    @CreateDateColumn({ name: 'create_at' })
    createAt: string

    @UpdateDateColumn({ name: 'update_at' })
    updateAt: string

    @OneToMany(() => Phone, (phone) => phone.person)
    phones: Phone[]

    @OneToOne(() => Address, (address) => address.person)
    @JoinColumn({ name: 'address_id' })
    address: Address
}
