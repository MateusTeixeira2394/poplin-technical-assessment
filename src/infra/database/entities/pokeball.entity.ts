import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Trainer } from './trainer.entity';

@Entity()
export class Pokeball {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  pokemonId: number;

  @ManyToOne(() => Trainer, (trainer) => trainer.pokeballs)
  trainer: Trainer;
}
