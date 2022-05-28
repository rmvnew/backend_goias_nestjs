import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

@Entity('COMPANY')
export class Company {

    @PrimaryGeneratedColumn()
    company_id: number

    @Column()
    company_real_name: string
   
    @Column()
    company_fantasy_name: string

    @Column()
    cnpj: string

    @Column({ name: 'is_active' })
    isActive: boolean

    @CreateDateColumn({ name: 'create_at' })
    createAt: string

    @UpdateDateColumn({ name: 'update_at' })
    updateAt: string

    
}
