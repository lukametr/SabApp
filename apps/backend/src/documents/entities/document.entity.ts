import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum DocumentFormat {
  WORD = 'word',
  EXCEL = 'excel',
  PDF = 'pdf',
}

export enum PersonCategory {
  EMPLOYEE = 'employee',
  VISITOR = 'visitor',
  CONTRACTOR = 'contractor',
  OTHER = 'other',
}

@Entity('documents')
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'enum', enum: DocumentFormat, default: DocumentFormat.WORD })
  format: DocumentFormat;

  @Column({ type: 'enum', enum: PersonCategory })
  personCategory: PersonCategory;

  @Column({ type: 'int', default: 0 })
  assessmentA: number;

  @Column({ type: 'int', default: 0 })
  assessmentSh: number;

  @Column({ type: 'int', default: 0 })
  assessmentR: number;

  @Column({ default: false })
  isFavorite: boolean;

  @Column({ nullable: true })
  cloudUrl: string;

  @Column({ type: 'timestamp', nullable: true })
  reviewDate: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'authorId' })
  author: User;

  @Column()
  authorId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 