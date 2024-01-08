import { IsDateString, IsIn, IsNotEmpty, IsString } from 'class-validator';

export class UpdateTaskDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['Ongoing', 'Pending', 'Completed'])
  status: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['Medium', 'Low', 'High'])
  priority: string;

  @IsString()
  @IsDateString()
  due_date: string;
}
