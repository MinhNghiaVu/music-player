// src/search-queries/dto/create-search-query.dto.ts
import { IsString, IsOptional, IsInt, IsBoolean } from 'class-validator';

export class CreateSearchQueryDto {
  @IsOptional()
  @IsString()
  user_id?: string;

  @IsString()
  query_text!: string;

  @IsOptional()
  @IsInt()
  result_count?: number;

  @IsOptional()
  @IsBoolean()
  clicked_result?: boolean;
}
