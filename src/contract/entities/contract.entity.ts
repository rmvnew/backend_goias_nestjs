import { Company } from "src/company/entities/company.entity";
import { Column, CreateDateColumn, Double, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('CONTRACT')
export class Contract {

    @PrimaryGeneratedColumn()
    contract_id: number

    @Column()
    company_id: number

    @Column({ name: 'contract_number' })
    contract_number: string

    @Column({ type: 'decimal', precision: 7, scale: 2 })
    value: number

    @Column({ name: 'is_active' })
    isActive: boolean

    @CreateDateColumn({ name: 'create_at' })
    createAt: string

    @UpdateDateColumn({ name: 'update_at' })
    updateAt: string

    @OneToOne(() => Company, (company) => company.contract)
    @JoinColumn({name: 'company_id'})
    company: Company

}
