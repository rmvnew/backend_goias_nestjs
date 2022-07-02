import { Address } from "src/address/entities/address.entity";
import { Client } from "src/client/entities/client.entity";
import { Phone } from "src/phone/entities/phone.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('PERSON')
export class Person {

    @PrimaryGeneratedColumn()
    person_id: number

    @Column()
    person_name: string

    @Column()
    person_rg: string

    @Column()
    person_cpf: string

    @Column()
    person_email: string

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

    @OneToOne(() => Client, (client) => client.person)
    client: Client;

    @OneToOne(() => User, (user) => user.person)
    user: User;
}
