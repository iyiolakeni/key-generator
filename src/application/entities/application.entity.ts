import { Key } from 'src/key/entities/key.entity';
import { EnvironmentType } from 'src/key/enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({
    type: 'enum',
    enum: EnvironmentType,
    default: EnvironmentType.DEVELOPMENT,
  })
  environment: EnvironmentType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Key, (key) => key.application, {
    cascade: true,
  })
  keys: Key[];
}
