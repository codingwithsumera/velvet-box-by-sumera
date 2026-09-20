import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Category name must be at least 3 characters long' })
  name: string;
}
