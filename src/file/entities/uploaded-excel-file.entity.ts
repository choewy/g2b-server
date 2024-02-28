import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from 'src/user/entities/user.entity';

import { UploadedExcelFileType } from './enums';

@Entity()
@Index('uploaded_excel_file_idx_user_type', ['user.id', 'type'])
export class UploadedExcelFile {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  readonly id: number;

  @Column({ type: 'varchar', length: 20 })
  type: UploadedExcelFileType;

  @Column({ type: 'varchar', length: 255, unique: true })
  key: string;

  @Column({ type: 'varchar', length: 50 })
  filename: string;

  @CreateDateColumn()
  readonly uploadedAt: Date;

  @ManyToOne(() => User, (e) => e.uploadedExcelFiles, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn()
  user: User | null;
}
