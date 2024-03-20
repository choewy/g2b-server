import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { KeywordType } from './enums';
import { UserEntity } from './user.entity';

@Index('keyword_idx_user_type', ['user.id', 'type'])
@Index('keyword_idx_user_type_text', ['user.id', 'type', 'text'])
@Entity({ name: 'keyword' })
export class KeywordEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  readonly id: number;

  @Column({ type: 'varchar', length: 10 })
  type: KeywordType;

  @Column({ type: 'varchar', length: 50 })
  text: string;

  @CreateDateColumn({ type: 'timestamp' })
  readonly createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  readonly updatedAt: Date;

  @ManyToOne(() => UserEntity, (e) => e.keywords, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: UserEntity;
}
