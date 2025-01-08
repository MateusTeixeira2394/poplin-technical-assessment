import { Expose } from 'class-transformer';

export class FindOnePokemonAdapterDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  height: number;

  @Expose()
  weight: number;
}
