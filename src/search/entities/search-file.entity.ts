import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SearchFile {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  readonly id: number;

  @Column({ type: 'varchar', length: 512 })
  key: string;

  @Column({ type: 'varchar', length: 50 })
  filename: string;

  @Column({ type: 'varchar', length: 100 })
  mimetype: string;

  @Column({ type: 'varchar', length: 20 })
  extension: string;

  @CreateDateColumn()
  readonly updatedAt: Date;
}
