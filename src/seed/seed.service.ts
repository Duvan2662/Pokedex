import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { CreatePokemonDto } from 'src/pokemon/dto/create-pokemon.dto';
import { PokemonService } from '../pokemon/pokemon.service';


@Injectable()
export class SeedService {


  constructor(
    private readonly  pokemonServices:PokemonService,
  ){

  }

  private readonly axios:AxiosInstance = axios;
  
  public async executeSeed() {

    //Sirve para eliminar los datos que ya existen en la base de datos 
    //DELETE * FROM Pokemons
    const dataOfBase = await this.pokemonServices.findAll();
    dataOfBase.forEach(async({_id})=> {
      await this.pokemonServices.remove(_id.toString())
    })
    

    //Insertar datos desde la Api de pokeApi que esta en la web
    const pokemonInsert: {name:string, no: number}[] = [];
    const { data } = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');
    data.results.forEach(({ name, url }) => {
      
      const segments = url.split('/');
      const numeroPokemon: number = + segments[segments.length - 2]

      // console.log({name, numeroPokemon}); 

      const pokemon:CreatePokemonDto = {
        name:name,
        no:numeroPokemon
      };
      pokemonInsert.push(pokemon);
    })
    await this.pokemonServices.insertArrayData(pokemonInsert);

    return `Executed Seed`;
  }
}
