import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeepPartial,
  Entity,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { EmailVerificationEntity } from './email-verification.entity';
import { ExcelEntity } from './excel.entity';
import { KeywordEntity } from './keyword.entity';
import { SearchEntity } from './saerch.entity';

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

  @OneToMany(() => SearchEntity, (e) => e.user, { cascade: true })
  @JoinTable()
  searches: SearchEntity[];

  @OneToMany(() => ExcelEntity, (e) => e.user, { cascade: true })
  @JoinTable()
  excels: ExcelEntity[];

  @OneToMany(() => EmailVerificationEntity, (e) => e.user, { cascade: true })
  @JoinTable()
  emailVerifications: EmailVerificationEntity[];

  constructor(args?: DeepPartial<Pick<UserEntity, 'password' | 'email' | 'name'>>) {
    super();

    if (args) {
      this.email = args.email;
      this.name = args.name;
      this.password = args.password;
    }
  }
}
