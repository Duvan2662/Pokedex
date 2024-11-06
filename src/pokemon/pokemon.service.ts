import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { NotFoundError } from 'rxjs';

@Injectable()
export class PokemonService {

  constructor(

    @InjectModel(Pokemon.name)
    private readonly pokemonModel:Model<Pokemon>
  ){

  }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();
    
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(`Pokemon exist in base of data ${JSON.stringify(error.keyValue)}`)
      }
      console.log(error);

      throw new InternalServerErrorException(`Can't create Pokemon - Check server logs`)
    }
    
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(busqueda: string) {
    let pokemon:Pokemon;

    //Busca por numero en la base de datos (no)
    if (!isNaN(+busqueda)) {
      pokemon = await this.pokemonModel.findOne({no:busqueda})
    }

    //Busca por MongoId
    if (!pokemon && isValidObjectId(busqueda)) {
      pokemon = await this.pokemonModel.findById(busqueda);
    }

    //Busca por Nombre

    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({name:busqueda.toLowerCase().trim()})
    }

    //Si no encuentra nada
    if (!pokemon) {
      throw new NotFoundException(`Pokemon with id, name or no "${busqueda}" not found`);
    }

    return pokemon;
  }

  update(id: number, updatePokemonDto: UpdatePokemonDto) {
    return `This action updates a #${id} pokemon`;
  }

  remove(id: number) {
    return `This action removes a #${id} pokemon`;
  }
}
