import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import * as AWS from 'aws-sdk';

const dynamoDB = process.env.IS_OFFLINE
  ? new AWS.DynamoDB.DocumentClient({
      region: "localhost",
      endpoint: "http://localhost:5000",
    })
  : new AWS.DynamoDB.DocumentClient();

export interface Food {
	name: string;
	type: String;
	price: string;
}

@Injectable()
export class FoodService {

  async getFoods(): Promise<Array<Food>> {
    try {
			const result = [];
			let items;

			do {
        items = await dynamoDB.scan({
          TableName: "foodsTable",
        }).promise();

        items.Items.forEach((item) => result.push(item));
    } while (typeof items.LastEvaluatedKey != "undefined");

		return result;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async createFood(food: Food): Promise<any> {
    const foodObj = {
      id: uuid(),
      ...food,
    };
    try {
      await dynamoDB
        .put({
          TableName: "foodsTable",
          Item: foodObj,
        })
        .promise();

			return {
				result: {
					id: foodObj.id,
				}
			};
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async getFood(id: string): Promise<any> {
    try {
      const food =  await dynamoDB
        .get({
          TableName: "foodsTable",
          Key: { id },
        })
        .promise();

			return food;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async deleteFood(id: string): Promise<any> {
    try {
      const result =  await dynamoDB
        .delete({
          TableName: "foodsTable",
          Key: {
            id,
          },
        })
        .promise();

			return result;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
