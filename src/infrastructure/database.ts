import { DynamoDBDocumentClient, PutCommand, QueryCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { FusionData, CustomData } from '../domain/models';

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(client);

export class DatabaseRepository {
  private readonly tableName: string;

  constructor() {
    this.tableName = process.env.DYNAMO_TABLE || 'StarWarsWeatherFusion';
  }

  async saveFusionData(data: FusionData): Promise<void> {
    const command = new PutCommand({
      TableName: this.tableName,
      Item: {
        PK: `FUSION#${data.id}`,
        SK: `TIMESTAMP#${data.timestamp}`,
        ...data,
        type: 'fusion'
      }
    });
    await docClient.send(command);
  }

  async saveCustomData(data: CustomData): Promise<void> {
    const command = new PutCommand({
      TableName: this.tableName,
      Item: {
        PK: `CUSTOM#${data.id}`,
        SK: `CREATED#${data.createdAt}`,
        ...data,
        type: 'custom'
      }
    });
    await docClient.send(command);
  }

  async getFusionHistory(limit: number = 10, lastEvaluatedKey?: any): Promise<{ items: FusionData[]; lastKey?: any }> {
    const command = new QueryCommand({
        TableName: this.tableName,
        IndexName: 'TypeIndex',
        KeyConditionExpression: '#type = :type',
        ExpressionAttributeNames: {
            '#type': 'type'
        },
        ExpressionAttributeValues: {
            ':type': 'fusion'
        },
        Limit: limit,
        ScanIndexForward: false,
        ExclusiveStartKey: lastEvaluatedKey
    });
    const result = await docClient.send(command);
    return {
       items: result.Items as FusionData[],
       lastKey: result.LastEvaluatedKey
    };
  }

  async getCustomDataHistory(limit: number = 10, lastEvaluatedKey?: any): Promise<{ items: CustomData[]; lastKey?: any }> {
    const command = new QueryCommand({
      TableName: this.tableName,
      IndexName: 'TypeIndex',
      KeyConditionExpression: '#type = :type',
      ExpressionAttributeNames: {
        '#type': 'type'
      },
      ExpressionAttributeValues: {
        ':type': 'custom'
      },
      Limit: limit,
      ScanIndexForward: false,
      ExclusiveStartKey: lastEvaluatedKey
    });

    const result = await docClient.send(command);
    return {
      items: result.Items as CustomData[],
      lastKey: result.LastEvaluatedKey
    };
  }

  async getCachedFusionData(cacheKey: string): Promise<FusionData | null> {
    const command = new QueryCommand({
      TableName: this.tableName,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
      ExpressionAttributeValues: {
        ':pk': `CACHE#${cacheKey}`,
        ':sk': 'TIMESTAMP#'
      },
      Limit: 1,
      ScanIndexForward: false
    });

    const result = await docClient.send(command);
    return result.Items?.[0] as FusionData || null;
  }

  async cacheFusionData(cacheKey: string, data: FusionData): Promise<void> {
    const command = new PutCommand({
      TableName: this.tableName,
      Item: {
        PK: `CACHE#${cacheKey}`,
        SK: `TIMESTAMP#${data.timestamp}`,
        ...data,
        type: 'cache',
        ttl: Math.floor(Date.now() / 1000) + 1800 // 30 minutos en segundos
      }
    });

    await docClient.send(command);
  }
}