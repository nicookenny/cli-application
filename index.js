"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const process_1 = require("process");
const chalk_1 = __importDefault(require("chalk"));
const promises_1 = require("fs/promises");
const prompts_1 = __importDefault(require("prompts"));
const program = new commander_1.Command();
const DATABASE_PATH = 'users.json';
class User {
    constructor({ name, lastname, age }) {
        this.ID = User.last;
        this.name = name;
        this.lastname = lastname;
        this.age = age;
        User.last++;
    }
}
User.last = 1;
const addUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield getUsers();
    users.push(user);
    yield (0, promises_1.writeFile)(DATABASE_PATH, JSON.stringify(users));
});
const getUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = (yield (0, promises_1.readFile)(DATABASE_PATH)).toString();
        if (!result) {
            yield (0, promises_1.writeFile)(DATABASE_PATH, JSON.stringify([]));
            return [];
        }
        return JSON.parse(result);
    }
    catch (error) {
        yield (0, promises_1.writeFile)(DATABASE_PATH, JSON.stringify([]));
        return [];
    }
});
const getUser = (ID) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield getUsers();
    return users.find((user) => user.ID === ID);
});
program.name('nucba-cli').description('CLI Application from NUCBA to NUCBERS').version('1.0.0');
program
    .command('information')
    .description('Recibirás toda la información acerca de NUCBA')
    .action((a, b) => {
    console.log(chalk_1.default.red('Bienvenido a NUCBA, amigo'));
});
program
    .command('users')
    .description('Administra los usuarios de tu base de datos :)')
    .action(() => __awaiter(void 0, void 0, void 0, function* () {
    const { action } = yield (0, prompts_1.default)({
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
            const { user_name } = yield (0, prompts_1.default)({
                type: 'text',
                name: 'user_name',
                message: 'Ingresa el nombre',
            });
            const { user_lastname } = yield (0, prompts_1.default)({
                type: 'text',
                name: 'user_lastname',
                message: 'Ingresa el apellido',
            });
            const { user_age } = yield (0, prompts_1.default)({
                type: 'number',
                name: 'user_age',
                message: 'Ingresa el nombre',
            });
            const createdUser = new User({
                name: user_name,
                lastname: user_lastname,
                age: user_age,
            });
            yield addUser(createdUser);
            return console.log(chalk_1.default.green('Usuario creado con éxito'));
    }
}));
program.parse(process_1.argv);
