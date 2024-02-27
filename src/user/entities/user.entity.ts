import { Entity, JoinTable, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Keyword } from 'src/keyword/entity/keyword.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  readonly id: number;

  @OneToMany(() => Keyword, (e) => e.user, { cascade: true })
  @JoinTable()
  keywords: Keyword[];
}
