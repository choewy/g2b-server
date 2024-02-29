import { Column, Entity, JoinTable, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Keyword } from 'src/keyword/entities/keyword.entity';
import { SearchState } from 'src/search/entities/search-state.entity';
import { UploadedExcelFile } from 'src/file/entities/uploaded-excel-file.entity';
import { SignupEmailVerification } from 'src/email/entities/signup-email-verification.entity';
import { ResetPasswordEmailVerification } from 'src/email/entities/reset-password-email-verification.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  readonly id: number;

  @Column({ type: 'varchar', length: 400, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 200 })
  password: string;

  @Column({ type: 'boolean', default: false })
  verified: boolean;

  @OneToMany(() => Keyword, (e) => e.user, { cascade: true })
  @JoinTable()
  keywords: Keyword[];

  @OneToMany(() => SearchState, (e) => e.user, { cascade: true })
  @JoinTable()
  searchStates: SearchState[];

  @OneToMany(() => UploadedExcelFile, (e) => e.user, { cascade: true })
  @JoinTable()
  uploadedExcelFiles: UploadedExcelFile[];

  @OneToMany(() => SignupEmailVerification, (e) => e.user, { cascade: true })
  @JoinTable()
  signupEmailVerifications: SignupEmailVerification[];

  @OneToMany(() => ResetPasswordEmailVerification, (e) => e.user, { cascade: true })
  @JoinTable()
  resetPasswordEmailVerification: ResetPasswordEmailVerification[];
}
