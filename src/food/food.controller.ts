import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Food, FoodService } from './food.service';

@Controller('food')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Get(':id')
  async getFood(@Param() id: string): Promise<any> {
    const result = await this.foodService.getFood(id);

		return result;
  }

	@Post()
  async createFood(@Body() food: Food): Promise<any> {
    return await this.foodService.createFood(food);
  }
}
