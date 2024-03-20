import { BaseEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { SearchStateType } from './enums';
import { UserEntity } from './user.entity';

@Index('uploaded_excel_file_idx_user_type', ['user.id', 'type'])
@Entity({ name: 'excel' })
export class ExcelEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  readonly id: number;

  @Column({ type: 'varchar', length: 20 })
  type: SearchStateType;

  @Column({ type: 'varchar', length: 255, unique: true })
  key: string;

  @Column({ type: 'varchar', length: 50 })
  filename: string;

  @CreateDateColumn({ type: 'timestamp' })
  readonly uploadedAt: Date;

  @ManyToOne(() => UserEntity, (e) => e.excels, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn()
  user: UserEntity | null;
}
