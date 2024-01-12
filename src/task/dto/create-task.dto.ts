import {
  IsArray,
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  farmId: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['Pending', 'Ongoing', 'Completed'])
  status: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['High', 'Medium', 'Low'])
  priority: string;

  @IsString()
  @IsNotEmpty()
  due_date: string;

  @IsArray()
  todo?: any;
}
