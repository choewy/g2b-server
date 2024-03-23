import { plainToInstance } from 'class-transformer';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeepPartial,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

  @Column({ type: 'text', nullable: true })
  error: string | null;

  @CreateDateColumn({ type: 'timestamp' })
  readonly startedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  readonly endedAt: Date | null;

  @ManyToOne(() => UserEntity, (e) => e.searches, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: UserEntity;

  constructor(args?: DeepPartial<Pick<SearchEntity, 'type' | 'processId'>> & { userId: number }) {
    super();

    if (args) {
      this.type = args.type;
      this.processId = args.processId;
      this.user = plainToInstance(UserEntity, { id: args.userId });
    }
  }
}
