import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
@Index('reset_password_email_verification_idx_email_temp_password', ['email', 'tempPassword'])
export class ResetPasswordEmailVerification {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  readonly id: number;

  @Column({ type: 'varchar', length: 400 })
  email: string;

  @Column({ type: 'char', length: 16 })
  tempPassword: string;

  @Column({ type: 'boolean', default: false })
  used: boolean;

  @Column({ type: 'datetime' })
  expiresIn: Date;

  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly updatedAt: Date;
}
