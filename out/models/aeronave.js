"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const objectManager_1 = __importDefault(require("../services/objectManager"));
const statusEtapa_1 = require("../enums/statusEtapa");
const statusPeca_1 = require("../enums/statusPeca");
const resultadoTeste_1 = require("../enums/resultadoTeste");
const tipoTeste_1 = require("../enums/tipoTeste");
class Aeronave {
    constructor(codigo, modelo, tipo, capacidade, alcance) {
        this.pecas = [];
        this.etapas = [];
        this.testes = [];
        this.codigo = codigo;
        this.modelo = modelo;
        this.tipo = tipo;
        this.capacidade = capacidade;
        this.alcance = alcance;
        this.pecas = [];
        this.etapas = [];
        this.testes = [];
    }
    adicionarPeca(peca) {
        const existe = this.pecas.find(p => p.nome === peca.nome);
        if (existe) {
            throw new Error("Peça já adicionada.");
        }
        this.pecas.push(peca);
    }
    salvarAeronave() {
        (0, objectManager_1.default)(this);
    }
    listarPecas() {
        if (this.pecas.length === 0) {
            console.log("Nenhuma peça cadastrada.");
            return;
        }
        console.log("Peças da aeronave:");
        this.pecas.forEach((peca, index) => {
            console.log(`[${index}] ${peca.nome} | Tipo: ${peca.tipo} | Status: ${peca.status}`);
        });
    }
    todasPecasProntas() {
        return this.pecas.every(p => p.status === statusPeca_1.StatusPeca.PRONTA);
    }
    adicionarEtapa(etapa) {
        this.etapas.push(etapa);
    }
    iniciarEtapa(index) {
        const etapa = this.etapas[index];
        if (!etapa) {
            throw new Error("Etapa não encontrada.");
        }
        if (!this.todasPecasProntas()) {
            throw new Error("Todas as peças devem estar prontas.");
        }
        if (index > 0 && this.etapas[index - 1].status !== statusEtapa_1.StatusEtapa.CONCLUIDA) {
            throw new Error("Etapa anterior não foi concluída.");
        }
        etapa.iniciar();
    }
    finalizarEtapa(index) {
        const etapa = this.etapas[index];
        if (!etapa) {
            throw new Error("Etapa não encontrada.");
        }
        etapa.finalizar();
    }
    listarEtapas() {
        if (this.etapas.length === 0) {
            console.log("Nenhuma etapa cadastrada.");
            return;
        }
        console.log("ETAPAS DA AERONAVE");
        this.etapas.forEach((etapa, index) => {
            console.log(`[${index}] ${etapa.nome} | Status: ${etapa.status} | Prazo: ${etapa.prazo}`);
        });
    }
    todasEtapasConcluidas() {
        return this.etapas.every(etapa => etapa.status === statusEtapa_1.StatusEtapa.CONCLUIDA);
    }
    adicionarTeste(teste) {
        if (!this.todasEtapasConcluidas()) {
            throw new Error("Não é possível adicionar teste antes de concluir todas as etapas.");
        }
        const existe = this.testes.find(t => t.tipo === teste.tipo);
        if (existe) {
            throw new Error("Teste desse tipo já foi realizado.");
        }
        this.testes.push(teste);
    }
    todosTestesRealizados() {
        const tipos = Object.values(tipoTeste_1.TipoTeste);
        return tipos.every(tipo => this.testes.some(t => t.tipo === tipo));
    }
    todosTestesAprovados() {
        return this.testes.every(teste => teste.resultado === resultadoTeste_1.ResultadoTeste.APROVADO);
    }
    listarTestes() {
        if (this.testes.length === 0) {
            console.log("Nenhum teste realizado.");
            return;
        }
        console.log("TESTES DA AERONAVE");
        this.testes.forEach((teste, index) => {
            console.log(`[${index}] ${teste.tipo} | Resultado: ${teste.resultado}`);
        });
    }
    detalhes() {
        console.log(`Detalhes da aeronave:
Codigo: ${this.codigo}
Modelo: ${this.modelo}
Tipo: ${this.tipo}
Capacidade: ${this.capacidade}
Alcance: ${this.alcance} km`);
        this.listarPecas();
        this.listarEtapas();
        this.listarTestes();
        console.log(`
Status final: ${this.todosTestesRealizados() && this.todosTestesAprovados()
            ? "APROVADA"
            : "REPROVADA"}
`);
    }
}
exports.default = Aeronave;
