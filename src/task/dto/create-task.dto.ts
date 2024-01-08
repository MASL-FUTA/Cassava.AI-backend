import { IsDateString, IsIn, IsNotEmpty, IsString } from 'class-validator';

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
  @IsDateString()
  due_date: string;
}
