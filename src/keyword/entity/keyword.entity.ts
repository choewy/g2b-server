import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { User } from 'src/user/entities/user.entity';

import { KeywordType } from './enums';

@Index('keyword_idx_user_type', ['user.id', 'type'])
@Index('keyword_idx_user_type_text', ['user.id', 'type', 'text'])
@Entity()
export class Keyword {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  readonly id: number;

  @Column({ type: 'varchar', length: 10 })
  type: KeywordType;

  @Column({ type: 'varchar', length: 50 })
  text: string;

  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly updatedAt: Date;

  @ManyToOne(() => User, (e) => e.keywords, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
}
