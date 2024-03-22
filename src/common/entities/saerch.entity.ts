import { BaseEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { SearchType } from './enums';
import { UserEntity } from './user.entity';

@Index('search_idx_user_type', ['user.id', 'type'])
@Entity({ name: 'search' })
export class SearchEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  readonly id: number;

  @Column({ type: 'varchar', length: 10 })
  type: SearchType;

  @Index('search_state_idx_process_id')
  @Column({ type: 'varchar', length: 50 })
  processId: string;

  @CreateDateColumn()
  readonly startedAt: Date;

  @ManyToOne(() => UserEntity, (e) => e.searches, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn()
  user: UserEntity | null;
}
