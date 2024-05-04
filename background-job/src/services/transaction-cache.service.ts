import { InvocationContext } from '@azure/functions';
import type { sheetClient } from '../bootstrap';
import { AzureTableCache, UpdateMode } from '../libs/azure-table-cache';
import { TransactionCacheEntity } from '../entities/transaction.entity';
import dayjs from 'dayjs';
import { UpdatedStats } from '../libs/table-cache';

export class TransactionCacheService {
  constructor(
    public readonly context: InvocationContext,
    public readonly sheet: typeof sheetClient.transaction,
    public readonly tableCache: AzureTableCache<TransactionCacheEntity>
  ) {}

  async updateWhenExpired(mode: UpdateMode = 'normal') {
    await this.tableCache.init();
    const sheetGenerator = this.sheet.readAll();
    const stats: UpdatedStats = {
      inserted: 0,
      updated: 0,
      skipped: 0,
      deleted: 0,
    };

    for await (const rowSheet of sheetGenerator) {
      const partitionKey = dayjs(rowSheet.Date).format('YYYY');
      if (!rowSheet.Id) {
        stats.skipped++;
        this.context.log('Skipping row without Id: ' + JSON.stringify(rowSheet));
        continue;
      }
      const tempStats = await this.tableCache.updateWhenExpired(
        {
          partitionKey,
          rowKey: rowSheet.Id,
        },
        {
          id: rowSheet.Id,
          amount: rowSheet.Amount,
          payee: rowSheet.Payee,
          category: rowSheet.Category,
          account: rowSheet.Account,
          date: rowSheet.Date,
          memo: rowSheet.Memo,
          updatedAt: rowSheet.UpdatedAt,
        },
        mode,
        rowSheet.UpdatedAt
      );
      stats.inserted += tempStats.inserted;
      stats.updated += tempStats.updated;
      stats.skipped += tempStats.skipped;
      stats.deleted += tempStats.deleted;
    }

    this.context.log('Stats: ' + JSON.stringify(stats));
  }

  async invalidateCache() {
    const stats: UpdatedStats = {
      inserted: 0,
      updated: 0,
      skipped: 0,
      deleted: 0,
    };
    await this.tableCache.init();
    const generator = this.tableCache.listAllExpiredRows();
    for await (const row of generator) {
      // this.context.log('Invalidating row: ' + JSON.stringify(row));
      if (!row.partitionKey || !row.rowKey) {
        stats.skipped++;
        this.context.log('Skipping row without PartitionKey or RowKey: ' + JSON.stringify(row));
        continue;
      }
      await this.tableCache.delete({
        partitionKey: String(row.PartitionKey),
        rowKey: String(row.RowKey),
      });
      stats.deleted++;
    }
    this.context.log('Invalidated cache: ' + JSON.stringify(stats));
  }

  async deleteNonExistentRows() {
    const stats: UpdatedStats = {
      inserted: 0,
      updated: 0,
      skipped: 0,
      deleted: 0,
    };
    await this.tableCache.init();
    const sheetRowIds = await this.sheet.getRowIds();
    const generator = this.tableCache.listAllRows();
    for await (const row of generator) {
      // this.context.log('Checking row: ' + JSON.stringify(row));
      if (!row.partitionKey || !row.rowKey) {
        stats.skipped++;
        this.context.log('Skipping row without PartitionKey or RowKey: ' + JSON.stringify(row));
        continue;
      }
      const sheetRow = sheetRowIds.has(String(row.rowKey));
      if (sheetRow === false) {
        await this.tableCache.delete({
          partitionKey: String(row.partitionKey),
          rowKey: String(row.rowKey),
        });
        stats.deleted++;
      }
    }
    this.context.log('Deleted non-existent rows: ' + JSON.stringify(stats));
  }
}
