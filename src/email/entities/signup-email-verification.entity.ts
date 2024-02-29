import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { User } from 'src/user/entities/user.entity';

@Entity()
export class SignupEmailVerification {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  readonly id: number;

  @Index('email_signup_verification_idx_code')
  @Column({ type: 'char', length: 8 })
  readonly code: string;

  @Column({ type: 'boolean', default: false })
  verified: boolean;

  @Column({ type: 'datetime' })
  expiresIn: Date;

  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly updatedAt: Date;

  @ManyToOne(() => User, (e) => e.signupEmailVerifications, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
}
