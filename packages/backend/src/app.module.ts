import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ContactsModule } from './contacts/contacts.module';
import { FlowsModule } from './flows/flows.module';
import { MessagesModule } from './messages/messages.module';
import { AutomationsModule } from './automations/automations.module';
import { IntegrationsModule } from './integrations/integrations.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { WebhookController } from './webhook/webhook.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ContactsModule,
    FlowsModule,
    MessagesModule,
    AutomationsModule,
    IntegrationsModule,
    DashboardModule,
  ],
  controllers: [WebhookController],
})
export class AppModule {}
