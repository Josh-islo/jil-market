import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('notification_templates')
export class NotificationTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: [
      'EMAIL_VERIFICATION',
      'PASSWORD_RESET',
      'PRICE_ALERT',
      'STOCK_ALERT',
      'EXPIRY_ALERT',
      'ORDER_CONFIRMATION',
      'ORDER_STATUS',
      'WELCOME',
    ],
  })
  type: string;

  @Column({ type: 'jsonb' })
  content: {
    fr: {
      subject?: string;
      body: string;
    };
    en: {
      subject?: string;
      body: string;
    };
  };

  @Column({ type: 'jsonb', nullable: true })
  metadata: {
    variables: string[];
    preview?: string;
    category?: string;
  };

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}