import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { EmailVerificationType } from './enums';
import { UserEntity } from './user.entity';

@Index('email_verification_idx_user_type', ['user.id', 'type'])
@Index('email_verification_idx_type_code', ['type', 'code'])
@Entity({ name: 'email_verification' })
export class EmailVerificationEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  readonly id: number;

  @Column({ type: 'varchar', length: 20 })
  readonly type: EmailVerificationType;

  @Column({ type: 'char', length: 6 })
  readonly code: string;

  @Column({ type: 'boolean', default: false })
  verified: boolean;

  @Column({ type: 'timestamp' })
  expiresIn: Date;

  @CreateDateColumn({ type: 'timestamp' })
  readonly createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  readonly updatedAt: Date;

  @ManyToOne(() => UserEntity, (e) => e.emailVerifications, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn()
  user: UserEntity | null;
}
