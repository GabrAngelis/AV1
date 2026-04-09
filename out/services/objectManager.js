"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = salvarObjeto;
const funcionario_1 = __importDefault(require("../models/funcionario"));
const fileManager_1 = __importDefault(require("./fileManager"));
function salvarObjeto(objeto) {
    let arquivo = "";
    if (objeto instanceof funcionario_1.default) {
        arquivo = "funcionarios.json";
    }
    else {
        throw new Error("Tipo inválido");
    }
    (0, fileManager_1.default)(arquivo, objeto);
}
