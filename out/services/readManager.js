"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lerArquivo = lerArquivo;
const fs_1 = __importDefault(require("fs"));
function lerArquivo(caminho) {
    try {
        if (!fs_1.default.existsSync(caminho)) {
            return [];
        }
        const dados = fs_1.default.readFileSync(caminho, "utf-8");
        if (!dados.trim()) {
            return [];
        }
        return JSON.parse(dados);
    }
    catch (erro) {
        console.error("Erro ao ler arquivo:", erro);
        return [];
    }
}
