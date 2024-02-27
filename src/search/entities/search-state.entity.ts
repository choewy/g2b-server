import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from 'src/user/entities/user.entity';

import { SearchStateType } from './enums';

@Index('search_state_idx_user_type', ['user.id', 'type'])
@Entity()
export class SearchState {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  readonly id: number;

  @Column({ type: 'varchar', length: 10 })
  type: SearchStateType;

  @CreateDateColumn()
  readonly startedAt: Date;

  @ManyToOne(() => User, (e) => e.searchStates, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User | null;
}
