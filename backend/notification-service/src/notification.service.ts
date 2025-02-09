import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationTemplate } from './entities/notification-template.entity';
import { NotificationLog } from './entities/notification-log.entity';
import { FirebaseMessaging } from 'firebase-admin/messaging';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly firebaseMessaging: FirebaseMessaging,
    @InjectRepository(NotificationTemplate)
    private readonly templateRepository: Repository<NotificationTemplate>,
    @InjectRepository(NotificationLog)
    private readonly logRepository: Repository<NotificationLog>,
  ) {}

  async sendEmailVerification(user: any, token: string) {
    const template = await this.templateRepository.findOne({
      where: { type: 'EMAIL_VERIFICATION' },
    });

    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

    await this.sendEmail({
      to: user.email,
      subject: 'Vérification de votre compte JIL Market',
      template: template.name,
      context: {
        name: user.fullName,
        verificationUrl,
      },
    });

    await this.logNotification({
      userId: user.id,
      type: 'EMAIL',
      templateType: 'EMAIL_VERIFICATION',
      status: 'SENT',
    });
  }

  async sendPriceAlert(user: any, product: any, oldPrice: number, newPrice: number) {
    // Email
    if (user.preferences.notifications.email) {
      const template = await this.templateRepository.findOne({
        where: { type: 'PRICE_ALERT' },
      });

      await this.sendEmail({
        to: user.email,
        subject: 'Alerte prix JIL Market',
        template: template.name,
        context: {
          name: user.fullName,
          productName: product.name,
          oldPrice,
          newPrice,
          savings: oldPrice - newPrice,
          productUrl: `${process.env.FRONTEND_URL}/products/${product.id}`,
        },
      });
    }

    // Push Notification
    if (user.preferences.notifications.push && user.pushToken) {
      await this.sendPushNotification({
        token: user.pushToken,
        title: 'Baisse de prix détectée !',
        body: `Le prix de ${product.name} a baissé de ${oldPrice} à ${newPrice} FCFA`,
        data: {
          type: 'PRICE_ALERT',
          productId: product.id,
        },
      });
    }

    // SMS
    if (user.preferences.notifications.sms && user.phone) {
      await this.sendSMS({
        to: user.phone,
        message: `JIL Market: Le prix de ${product.name} a baissé de ${oldPrice} à ${newPrice} FCFA. Économisez ${oldPrice - newPrice} FCFA!`,
      });
    }
  }

  private async sendEmail(options: {
    to: string;
    subject: string;
    template: string;
    context: any;
  }) {
    try {
      await this.mailerService.sendMail({
        to: options.to,
        subject: options.subject,
        template: options.template,
        context: options.context,
      });
    } catch (error) {
      this.logger.error(`Erreur d'envoi d'email: ${error.message}`, error.stack);
      throw error;
    }
  }

  private async sendPushNotification(options: {
    token: string;
    title: string;
    body: string;
    data?: Record<string, string>;
  }) {
    try {
      await this.firebaseMessaging.send({
        token: options.token,
        notification: {
          title: options.title,
          body: options.body,
        },
        data: options.data,
        android: {
          priority: 'high',
          notification: {
            clickAction: 'FLUTTER_NOTIFICATION_CLICK',
            channelId: 'jil_market_alerts',
          },
        },
      });
    } catch (error) {
      this.logger.error(`Erreur d'envoi de notification push: ${error.message}`, error.stack);
      throw error;
    }
  }

  private async sendSMS(options: { to: string; message: string }) {
    try {
      // Intégration avec un service SMS local (à implémenter)
      this.logger.log(`SMS envoyé à ${options.to}: ${options.message}`);
    } catch (error) {
      this.logger.error(`Erreur d'envoi de SMS: ${error.message}`, error.stack);
      throw error;
    }
  }

  private async logNotification(data: {
    userId: string;
    type: 'EMAIL' | 'PUSH' | 'SMS';
    templateType: string;
    status: 'SENT' | 'FAILED';
    error?: string;
  }) {
    await this.logRepository.save({
      ...data,
      timestamp: new Date(),
    });
  }
}