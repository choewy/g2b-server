import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { AggregateRoot } from '@nestjs/cqrs';

import { User } from 'src/user/entities/user.entity';

import { SearchStateType } from './enums';

@Entity()
export class SearchState extends AggregateRoot {
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
