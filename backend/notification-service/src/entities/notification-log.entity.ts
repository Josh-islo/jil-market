import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('notification_logs')
export class NotificationLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  userId: string;

  @Column({
    type: 'enum',
    enum: ['EMAIL', 'PUSH', 'SMS'],
  })
  type: string;

  @Column()
  templateType: string;

  @Column({
    type: 'enum',
    enum: ['SENT', 'FAILED'],
  })
  status: string;

  @Column({ type: 'text', nullable: true })
  error: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: {
    deviceInfo?: string;
    provider?: string;
    attempt?: number;
    responseTime?: number;
  };

  @CreateDateColumn()
  @Index()
  timestamp: Date;

  @Column({ type: 'jsonb', nullable: true })
  context: Record<string, any>;
}