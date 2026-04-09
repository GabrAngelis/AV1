"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const objectManager_1 = __importDefault(require("../services/objectManager"));
const readManager_1 = require("../services/readManager");
class Funcionario {
    constructor(id, nome, telefone, endereco, usuario, senha, nivelPermissao) {
        this.id = id;
        this.nome = nome;
        this.telefone = telefone;
        this.endereco = endereco;
        this.usuario = usuario;
        this.senha = senha;
        this.nivelPermissao = nivelPermissao;
    }
    salvarFuncionario() {
        const funcionarios = (0, readManager_1.lerArquivo)("funcionarios.json") || [];
        const existe = funcionarios.find((f) => f.usuario === this.usuario);
        if (existe) {
            throw new Error("Usuário já existe.");
        }
        (0, objectManager_1.default)(this);
    }
    static autenticar(usuario, senha) {
        const funcionarios = (0, readManager_1.lerArquivo)("funcionarios.json") || [];
        const encontrado = funcionarios.find((f) => f.usuario === usuario && f.senha === senha);
        if (!encontrado) {
            throw new Error("Usuário ou senha inválidos.");
        }
        return encontrado;
    }
}
exports.default = Funcionario;
