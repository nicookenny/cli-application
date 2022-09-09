import { Command } from 'commander';
import { argv } from 'process';
import chalk from 'chalk';
import { readFile, writeFile } from 'fs/promises';
import prompt from 'prompts';

const program = new Command();

const DATABASE_PATH = 'users.json';

interface IUser {
  name: string;
  lastname: string;
  age: number;
}

class User {
  static last = 1;
  ID: number;
  name: string;
  lastname: string;
  age: number;
  constructor({ name, lastname, age }: IUser) {
    this.ID = User.last;
    this.name = name;
    this.lastname = lastname;
    this.age = age;

    User.last++;
  }
}

const addUser = async (user: User) => {
  const users = await getUsers();
  users.push(user);

  await writeFile(DATABASE_PATH, JSON.stringify(users));
};

const getUsers = async (): Promise<User[]> => {
  try {
    const result = (await readFile(DATABASE_PATH)).toString();
    if (!result) {
      await writeFile(DATABASE_PATH, JSON.stringify([]));
      return [];
    }
    return JSON.parse(result);
  } catch (error) {
    await writeFile(DATABASE_PATH, JSON.stringify([]));
    return [];
  }
};

const getUser = async (ID: number) => {
  const users = await getUsers();
  return users.find((user) => user.ID === ID);
};

program.name('nucba-cli').description('CLI Application from NUCBA to NUCBERS').version('1.0.0');

program
  .command('information')
  .description('Recibirás toda la información acerca de NUCBA')
  .action((a, b) => {
    console.log(chalk.red('Bienvenido a NUCBA, amigo'));
  });

program
  .command('users')
  .description('Administra los usuarios de tu base de datos :)')
  .action(async () => {
    const { action } = await prompt({
      type: 'select',
      name: 'action',
      message: '¿Qué queres hacer con los usuarios?',
      choices: [
        {
          title: 'Agregar',
          value: 'C',
        },
        {
          title: 'Ver listado',
          value: 'R',
        },
        {
          title: 'Actualizar usuario',
          value: 'U',
        },
        {
          title: 'Eliminar un usuario',
          value: 'D',
        },
      ],
    });

    switch (action) {
      case 'C':
        const { user_name } = await prompt({
          type: 'text',
          name: 'user_name',
          message: 'Ingresa el nombre',
        });
        const { user_lastname } = await prompt({
          type: 'text',
          name: 'user_lastname',
          message: 'Ingresa el apellido',
        });
        const { user_age } = await prompt({
          type: 'number',
          name: 'user_age',
          message: 'Ingresa el nombre',
        });
        const createdUser = new User({
          name: user_name,
          lastname: user_lastname,
          age: user_age,
        });
        await addUser(createdUser);
        return console.log(chalk.green('Usuario creado con éxito'));
    }
  });

program.parse(argv);
