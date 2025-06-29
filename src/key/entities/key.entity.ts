import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { KeyType } from '../enum';
import { Application } from 'src/application/entities/application.entity';

@Entity()
export class Key {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'simple-enum',
    enum: KeyType,
  })
  type: KeyType;

  @Column({ type: 'text' })
  value: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  expiresAt?: Date;

  @Column({ type: 'json', nullable: true })
  metadata?: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Application, (application) => application.keys)
  @JoinColumn({ name: 'applicationId' })
  application: Application;

  @Column()
  applicationId: string;
}
