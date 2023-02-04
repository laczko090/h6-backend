import { Module } from '@nestjs/common';
import { FoodModule } from './food/food.module';

@Module({
  imports: [FoodModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
