<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  

# Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Ejecutar en Desarrollo

1. Clonar el repositorio
```bash
$ git clone https://github.com/Duvan2662/Pokedex.git
```

2. Ejecutar 
```bash
$ npm install
```

3. Tener Nest CLI instalado
```bash
$ npm i -g @nestjs/cli
```

4. Clonar el archivo ```.env.template``` y renombrar la copia a ```.env```

5. Llenar las variables de entorno definidas en el ```.env```

6. Levantar la base de datos (Se debe tener corriendo el Docker desktop)
```bash
$ docker-compose up -d
```

7. Poner a correr la API en modo desarrollador   
```bash
$ npm run start:dev
```

8. Reconstruir la base de datos con la semilla si no se tienen ningun Pokemon usando Postman realizar una peticion GET con el siguiente endpoint  
```bash
$ http://localhost:3000/api/v2/seed
```

## Stack usado
* Mongo DB
* Nest


# Production Build
1. Crear el archivo ```.env.prod```
2. Llenar las variables de entorno de produccion
3. Crear la nueva imagen con el comando
```bash
$ docker-compose -f docker-compose.prod.yaml --env-file .env.prod up --build
```

