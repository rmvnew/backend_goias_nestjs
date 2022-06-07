import { Address } from "src/address/entities/address.entity"
import { Contract } from "src/contract/entities/contract.entity"
import { Phone } from "src/phone/entities/phone.entity"
import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

@Entity('COMPANY')
export class Company {

    @PrimaryGeneratedColumn()
    company_id: number

    @Column()
    address_id: number

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

    @OneToOne(() => Address, (address) => address.company)
    @JoinColumn({ name: 'address_id' })
    address: Address

    @OneToMany(() => Phone, (phone) => phone.company)
    phones: Phone[]

    @OneToOne(() => Contract, (contract) => contract.company)
    contract: Contract


}
