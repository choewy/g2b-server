import { BaseEntity, Column, CreateDateColumn, Entity, JoinTable, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { EmailVerificationEntity } from './email-verification.entity';
import { ExcelEntity } from './excel.entity';
import { KeywordEntity } from './keyword.entity';
import { SearchStateEntity } from './saerch-state.entity';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  readonly id: number;

  @Column({ type: 'varchar', length: 400, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 200 })
  password: string;

  @Column({ type: 'boolean', default: false })
  verified: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  readonly createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  readonly updatedAt: Date;

  @OneToMany(() => KeywordEntity, (e) => e.user, { cascade: true })
  @JoinTable()
  keywords: KeywordEntity[];

  @OneToMany(() => SearchStateEntity, (e) => e.user, { cascade: true })
  @JoinTable()
  searchStates: SearchStateEntity[];

  @OneToMany(() => ExcelEntity, (e) => e.user, { cascade: true })
  @JoinTable()
  excels: ExcelEntity[];

  @OneToMany(() => EmailVerificationEntity, (e) => e.user, { cascade: true })
  @JoinTable()
  emailVerifications: EmailVerificationEntity[];
}
