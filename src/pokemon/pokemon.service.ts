import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class PokemonService {

  constructor(

    @InjectModel(Pokemon.name)
    private readonly pokemonModel:Model<Pokemon>
  ){}

  private readonly axios:AxiosInstance = axios;

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();
    
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleException(error);
    }
    
  }

  async findAll(): Promise<Pokemon[]> {
    return this.pokemonModel.find().exec();
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

  async update(busqueda: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(busqueda);

    if (updatePokemonDto.name) {
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    }

    try {
      await pokemon.updateOne(updatePokemonDto);
      return {...pokemon.toJSON(),...updatePokemonDto};
    } catch (error) {
      this.handleException(error);
    }
    
  }

  async remove(id: string) {
    // const pokemon = await this.findOne(id);
    // await pokemon.deleteOne();
    // return {id}
    // const resultado = await this.pokemonModel.findByIdAndDelete(id);
    const {deletedCount} = await this.pokemonModel.deleteMany({_id: id});
    if (deletedCount === 0) {
      throw new BadRequestException(`Pokemon with id "${id}" not found`);
    }
    return;
  }

  private handleException(error:any) {
    if (error.code === 11000) {
      throw new BadRequestException(`Pokemon exist in base of data ${JSON.stringify(error.keyValue)}`)
    }
    console.log(error);
    throw new InternalServerErrorException(`Can't create Pokemon - Check server logs`)
  }

  async insertArrayData(arrayOfPokemons:CreatePokemonDto[]){
    await this.pokemonModel.insertMany(arrayOfPokemons);
  }
}
