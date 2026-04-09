"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const statusPeca_1 = require("../enums/statusPeca");
const objectManager_1 = __importDefault(require("../services/objectManager"));
class Peca {
    constructor(nome, tipo, fornecedor, status) {
        this.nome = nome;
        this.tipo = tipo;
        this.fornecedor = fornecedor;
        this.status = status;
    }
    atualizarStatus() {
        switch (this.status) {
            case statusPeca_1.StatusPeca.EM_PRODUCAO:
                this.status = statusPeca_1.StatusPeca.EM_TRANSPORTE;
                break;
            case statusPeca_1.StatusPeca.EM_TRANSPORTE:
                this.status = statusPeca_1.StatusPeca.PRONTA;
                break;
            case statusPeca_1.StatusPeca.PRONTA:
                throw new Error("Peça já está finalizada");
        }
    }
    salvarPeca() {
        (0, objectManager_1.default)(this);
    }
}
exports.default = Peca;
