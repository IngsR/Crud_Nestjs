import { IsNotEmpty, IsString } from 'class-validator';

export class SearchProductDto {
  @IsString()
  @IsNotEmpty()
  q: string;
}
