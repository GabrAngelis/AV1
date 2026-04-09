"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const objectManager_1 = __importDefault(require("../services/objectManager"));
class Teste {
    constructor(tipo, resultado) {
        this.tipo = tipo;
        this.resultado = resultado;
    }
    salvarTeste() {
        (0, objectManager_1.default)(this);
    }
}
exports.default = Teste;
