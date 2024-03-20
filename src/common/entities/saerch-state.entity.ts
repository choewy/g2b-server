import { BaseEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { SearchStateType } from './enums';
import { UserEntity } from './user.entity';

@Index('search_state_idx_user_type', ['user.id', 'type'])
@Entity({ name: 'search_state' })
export class SearchStateEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  readonly id: number;

  @Column({ type: 'varchar', length: 10 })
  type: SearchStateType;

  @Index('search_state_idx_process_id')
  @Column({ type: 'varchar', length: 50 })
  processId: string;

  @CreateDateColumn()
  readonly startedAt: Date;

  @ManyToOne(() => UserEntity, (e) => e.searchStates, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn()
  user: UserEntity | null;
}
