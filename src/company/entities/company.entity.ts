import { Address } from "src/address/entities/address.entity"
import { Client } from "src/client/entities/client.entity"
import { Contract } from "src/contract/entities/contract.entity"
import { Phone } from "src/phone/entities/phone.entity"
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

@Entity('COMPANY')
export class Company {

    @PrimaryGeneratedColumn()
    company_id: number

    @Column({ length: 100 })
    company_real_name: string

    @Column({ length: 100 })
    company_fantasy_name: string

    @Column({ unique: true, length: 30 })
    cnpj: string

    @Column({ name: 'is_active' })
    isActive: boolean

    @CreateDateColumn({ name: 'create_at' })
    createAt: string

    @UpdateDateColumn({ name: 'update_at' })
    updateAt: string

    @OneToOne(() => Contract, (contract) => contract.company)
    contract: Contract

    @ManyToMany(() => Client, {eager: true})
    @JoinTable({
        name: 'CLIENT_COMPANY',
        joinColumn: { 
            name: 'company_id', 
            referencedColumnName: 'company_id' },
        inverseJoinColumn: { 
            name: 'client_id', 
            referencedColumnName: 'client_id' }
    })
    clients: Client[]


}
