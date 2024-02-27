import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

// enum inventoryUnit {
//   kg,
//   bags,
//   tonnes,
// }

export class InventoryDto {
  @IsString()
  @IsNotEmpty()
  harvestDate: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  unit?: any;
}
