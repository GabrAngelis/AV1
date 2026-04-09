"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const statusEtapa_1 = require("../enums/statusEtapa");
class Etapa {
    constructor(nome, prazo, status, funcionarios) {
        this.nome = nome;
        this.prazo = prazo;
        this.status = status;
        this.funcionarios = funcionarios;
    }
    associarFuncionario(funcionario) {
        const existe = this.funcionarios.find(f => f.id === funcionario.id);
        if (existe) {
            throw new Error('Funcionário já associado.');
        }
        this.funcionarios.push(funcionario);
    }
    listarFuncionarios() {
        this.funcionarios.forEach(f => {
            console.log(`${f.nome} - ${f.nivelPermissao}`);
        });
    }
    iniciar() {
        if (this.status !== statusEtapa_1.StatusEtapa.PENDENTE) {
            throw new Error("Etapa já iniciada!");
        }
        this.status = statusEtapa_1.StatusEtapa.ANDAMENTO;
    }
    finalizar() {
        if (this.status !== statusEtapa_1.StatusEtapa.ANDAMENTO) {
            throw new Error("Etapa não foi iniciada!");
        }
        this.status = statusEtapa_1.StatusEtapa.CONCLUIDA;
    }
}
exports.default = Etapa;
