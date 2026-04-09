"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = salvarArquivo;
exports.salvarLista = salvarLista;
const fs_1 = __importDefault(require("fs"));
function salvarArquivo(caminho, valor) {
    let dados = [];
    if (fs_1.default.existsSync(caminho)) {
        const conteudo = fs_1.default.readFileSync(caminho, 'utf-8');
        dados = JSON.parse(conteudo);
    }
    dados.push(valor);
    fs_1.default.writeFileSync(caminho, JSON.stringify(dados, null, 2));
}
function salvarLista(caminho, lista) {
    fs_1.default.writeFileSync(caminho, JSON.stringify(lista, null, 2));
}
