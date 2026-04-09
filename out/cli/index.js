"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const nivelPermissao_1 = require("../enums/nivelPermissao");
const funcionario_1 = __importDefault(require("../models/funcionario"));
// Limpar dados anteriores
const arquivos = ["aeronaves.json", "funcionarios.json", "relatorios.json"];
arquivos.forEach(arquivo => {
    if (fs_1.default.existsSync(arquivo)) {
        fs_1.default.unlinkSync(arquivo);
    }
});
console.log("Arquivos anteriores removidos.\n");
// Criar funcionários
const admin = new funcionario_1.default("1", "Admin", "123456789", "Rua dos admin, 1 - SJC", "admin", "admin123", nivelPermissao_1.NivelPermissao.ADMINISTRADOR);
const engenheiro = new funcionario_1.default("2", "Engenheiro", "987654321", "Rua dos engenheiros, 2 - SJC", "engenheiro", "eng123", nivelPermissao_1.NivelPermissao.ENGENHEIRO);
const operador = new funcionario_1.default("3", "Operador", "111111111", "Rua dos operadores, 3 - SJC", "operador", "op123", nivelPermissao_1.NivelPermissao.OPERADOR);
admin.salvarFuncionario();
engenheiro.salvarFuncionario();
operador.salvarFuncionario();
console.log("Funcionários criados:");
console.log(`${admin.nome} | Nível: ${admin.nivelPermissao} | Usuário: admin / Senha: admin`);
console.log(`${engenheiro.nome} | Nível: ${engenheiro.nivelPermissao} | Usuário: engenheiro / Senha: eng`);
console.log(`${operador.nome} | Nível: ${operador.nivelPermissao} | Usuário: operador / Senha: op`);
console.log("\nAmbiente pronto. Execute o menu para continuar.\n");
