import { plainToInstance } from 'class-transformer';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeepPartial,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { EmailVerificationType } from './enums';
import { UserEntity } from './user.entity';

@Index('email_verification_idx_user_type_code', ['user.id', 'type', 'code'])
@Index('email_verification_idx_email_type_code', ['email', 'type', 'code'])
@Entity({ name: 'email_verification' })
export class EmailVerificationEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  readonly id: number;

  @Column({ type: 'varchar', length: 20 })
  readonly type: EmailVerificationType;

  @Column({ type: 'varchar', length: 16 })
  readonly code: string;

  @Column({ type: 'varchar', length: 400, nullable: true })
  readonly email: string | null;

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

  constructor(args?: DeepPartial<Pick<EmailVerificationEntity, 'type' | 'code' | 'email'>> & { userId?: number; expiresIn?: Date }) {
    super();

    if (args) {
      this.type = args.type;
      this.code = args.code;
      this.email = args.email;
      this.expiresIn = args.expiresIn;
      this.user = plainToInstance(UserEntity, { id: args.userId });
    }
  }
}
