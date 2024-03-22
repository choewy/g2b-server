import { plainToInstance } from 'class-transformer';
import { BaseEntity, Column, CreateDateColumn, DeepPartial, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { SearchType } from './enums';
import { UserEntity } from './user.entity';

@Index('uploaded_excel_file_idx_user_type', ['user.id', 'type'])
@Entity({ name: 'excel' })
export class ExcelEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  readonly id: number;

  @Column({ type: 'varchar', length: 20 })
  type: SearchType;

  @Column({ type: 'varchar', length: 255, unique: true })
  key: string;

  @Column({ type: 'varchar', length: 50 })
  filename: string;

  @CreateDateColumn({ type: 'timestamp' })
  readonly uploadedAt: Date;

  @ManyToOne(() => UserEntity, (e) => e.excels, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn()
  user: UserEntity | null;

  constructor(args?: DeepPartial<Pick<ExcelEntity, 'type' | 'key' | 'filename'>> & { userId: number }) {
    super();

    if (args) {
      this.type = args.type;
      this.key = args.key;
      this.filename = args.filename;
      this.user = plainToInstance(UserEntity, { id: args.userId });
    }
  }
}
