export interface FindManyPokemonsAdatperDto {
  count: number;
  next: string;
  previous: string;
  results: Pokemon[];
}

interface Pokemon {
  name: string;
  url: string;
}
