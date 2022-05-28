import { Company } from "src/company/entities/company.entity";
import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('ADDRESS')
export class Address {

    @PrimaryGeneratedColumn()
    address_id: number

    @Column({ name: 'zip_code', length: 8 })
    zipCode: string

    @Column({length:100})
    street: string

    @Column({length:100})
    district: string

    @Column({length:100})
    city: string

    @Column({length:100})
    state: string

    @Column({length:100})
    country: string

    @Column({length:7})
    address_number: string

    @Column({ name: 'is_active'})
    isActive: boolean

    @CreateDateColumn({ name: 'create_at' })
    createAt: string

    @UpdateDateColumn({ name: 'update_at' })
    updateAt: string

    @OneToOne(() => Company, (company) => company.address)
    company: Company

}
