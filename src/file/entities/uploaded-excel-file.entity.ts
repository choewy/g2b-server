import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { UploadedExcelFileType } from './enums';
import { User } from 'src/user/entities/user.entity';

@Entity()
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
