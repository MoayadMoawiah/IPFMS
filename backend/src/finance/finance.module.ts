import { Module } from '@nestjs/common';
import { ChartOfAccountsController } from './chart-of-accounts/chart-of-accounts.controller';
import { ChartOfAccountsService } from './chart-of-accounts/chart-of-accounts.service';
import { JournalEntriesController } from './journal-entries/journal-entries.controller';
import { JournalEntriesService } from './journal-entries/journal-entries.service';
import { PaymentsController } from './payments/payments.controller';
import { PaymentsService } from './payments/payments.service';

@Module({
  controllers: [ChartOfAccountsController, JournalEntriesController, PaymentsController],
  providers: [ChartOfAccountsService, JournalEntriesService, PaymentsService],
  exports: [JournalEntriesService, PaymentsService],
})
export class FinanceModule {}
