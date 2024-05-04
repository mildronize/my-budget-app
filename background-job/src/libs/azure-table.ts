// Duplicate code from `budget-app` project, use monorepo later
import {
  ListTableEntitiesOptions,
  TableClient,
  TableServiceClientOptions,
  TableTransaction,
  UpdateMode,
} from '@azure/data-tables';

export interface AzureTableEntityBase {
  partitionKey: string;
  rowKey: string;
}

/**
 * Generic Azure Table class
 */
export class AzureTable<TEntity extends AzureTableEntityBase> {
  constructor(public readonly client: TableClient) {}

  async createTable() {
    return this.client.createTable();
  }

  /**
   * Query entities
   * TODO: may fix type safety later
   *
   * select prop type may incorrect
   */
  list(
    queryOptions?: ListTableEntitiesOptions['queryOptions'],
    listTableEntitiesOptions?: Omit<ListTableEntitiesOptions, 'queryOptions'>
  ) {
    return this.client.listEntities<TEntity>({
      ...listTableEntitiesOptions,
      queryOptions,
    });
  }

  async listAll(
    queryOptions?: ListTableEntitiesOptions['queryOptions'],
    listTableEntitiesOptions?: Omit<ListTableEntitiesOptions, 'queryOptions'>
  ) {
    const entities = this.client.listEntities<TEntity>({
      ...listTableEntitiesOptions,
      queryOptions,
    });

    const result = [];
    // List all the entities in the table
    for await (const entity of entities) {
      result.push(entity);
    }
    return result;
  }

  async insert(entity: TEntity) {
    return this.client.createEntity<TEntity>(entity);
  }

  async update(entity: TEntity, mode: UpdateMode = 'Replace') {
    return this.client.updateEntity<TEntity>(entity, mode);
  }

  async deleteEntities(
    queryOptions?: ListTableEntitiesOptions['queryOptions'],
    listTableEntitiesOptions?: Omit<ListTableEntitiesOptions, 'queryOptions'>
  ) {
    for await (const foundItem of this.list(queryOptions, listTableEntitiesOptions)) {
      await this.client.deleteEntity(foundItem.partitionKey, foundItem.rowKey);
    }
  }

  /**
   * All operations in a transaction must target the same partitionKey
   */

  async insertBatch(rawEntities: TEntity[]) {
    const groupByPartitionKey = this.groupPartitionKey(rawEntities);
    for (const entities of Object.values(groupByPartitionKey)) {
      const transaction = new TableTransaction();
      entities.forEach(entity => transaction.createEntity(entity));
      await this.client.submitTransaction(transaction.actions);
    }
  }

  /**
   * Group entities by partitionKey
   * Becasue all operations in a transaction must target the same partitionKey
   *
   * @param entities
   * @returns
   */
  groupPartitionKey(entities: TEntity[]) {
    return entities.reduce((acc, cur) => {
      if (!acc[cur.partitionKey]) {
        acc[cur.partitionKey] = [];
      }
      acc[cur.partitionKey].push(cur);
      return acc;
    }, {} as Record<string, TEntity[]>);
  }
}
