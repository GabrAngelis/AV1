"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const readline_1 = __importDefault(require("readline"));
const tipoAeronave_1 = require("../enums/tipoAeronave");
const tipoPeca_1 = require("../enums/tipoPeca");
const statusPeca_1 = require("../enums/statusPeca");
const statusEtapa_1 = require("../enums/statusEtapa");
const tipoTeste_1 = require("../enums/tipoTeste");
const resultadoTeste_1 = require("../enums/resultadoTeste");
const nivelPermissao_1 = require("../enums/nivelPermissao");
const aeronave_1 = __importDefault(require("../models/aeronave"));
const peca_1 = __importDefault(require("../models/peca"));
const etapa_1 = __importDefault(require("../models/etapa"));
const teste_1 = __importDefault(require("../models/teste"));
const funcionario_1 = __importDefault(require("../models/funcionario"));
const relatorio_1 = __importDefault(require("../models/relatorio"));
const readManager_1 = require("../services/readManager");
const fileManager_1 = require("../services/fileManager");
const rl = readline_1.default.createInterface({
    input: process.stdin,
    output: process.stdout
});
let usuarioLogado = null;
// Reconstrói os objetos aninhados ao carregar do arquivo
let aeronaves = ((0, readManager_1.lerArquivo)("aeronaves.json") || []).map((a) => {
    const aeronave = new aeronave_1.default(a.codigo, a.modelo, a.tipo, a.capacidade, a.alcance);
    aeronave.pecas = (a.pecas || []).map((p) => new peca_1.default(p.nome, p.tipo, p.fornecedor, p.status));
    aeronave.etapas = (a.etapas || []).map((e) => new etapa_1.default(e.nome, e.prazo, e.status, e.funcionarios || []));
    aeronave.testes = (a.testes || []).map((t) => new teste_1.default(t.tipo, t.resultado));
    return aeronave;
});
let aeronaveAtual = null;
function perguntar(pergunta) {
    return new Promise(resolve => rl.question(pergunta, resolve));
}
// Login
async function login() {
    console.log("\n--- LOGIN ---");
    const usuario = await perguntar("Usuário: ");
    const senha = await perguntar("Senha: ");
    try {
        usuarioLogado = funcionario_1.default.autenticar(usuario, senha);
        console.log(`\nBem-vindo, ${usuarioLogado.nome}`);
        menu();
    }
    catch (e) {
        console.log(e.message);
        login();
    }
}
// Menu
async function menu() {
    console.log(`
--- MENU ---
Usuário: ${(usuarioLogado === null || usuarioLogado === void 0 ? void 0 : usuarioLogado.nome) || "Nenhum"} (${(usuarioLogado === null || usuarioLogado === void 0 ? void 0 : usuarioLogado.nivelPermissao) || ""})
Aeronave atual: ${(aeronaveAtual === null || aeronaveAtual === void 0 ? void 0 : aeronaveAtual.codigo) || "Nenhuma"}

1 - Criar Aeronave
2 - Listar Aeronaves
3 - Selecionar Aeronave
4 - Adicionar Peça
5 - Atualizar Status de Peça
6 - Criar Etapa
7 - Iniciar Etapa
8 - Finalizar Etapa
9 - Adicionar Teste
10 - Gerar Relatório
11 - Criar Funcionário
0 - Sair
`);
    const opcao = await perguntar("Escolha: ");
    switch (opcao) {
        case "1":
            await criarAeronave();
            break;
        case "2":
            listarAeronaves();
            break;
        case "3":
            await selecionarAeronave();
            break;
        case "4":
            await adicionarPeca();
            break;
        case "5":
            await atualizarStatusPeca();
            break;
        case "6":
            await criarEtapa();
            break;
        case "7":
            await iniciarEtapa();
            break;
        case "8":
            await finalizarEtapa();
            break;
        case "9":
            await adicionarTestes();
            break;
        case "10":
            await gerarRelatorio();
            break;
        case "11":
            await criarFuncionario();
            break;
        case "0":
            rl.close();
            break;
        default: menu();
    }
}
// Aeronaves
async function criarAeronave() {
    const codigo = await perguntar("Código: ");
    if (aeronaves.some(a => a.codigo === codigo)) {
        console.log("Já existe uma aeronave com esse código.");
        return menu();
    }
    const modelo = await perguntar("Modelo: ");
    const tipo = await perguntar("Tipo (1-COMERCIAL / 2-MILITAR): ");
    const capacidade = Number(await perguntar("Capacidade: "));
    const alcance = Number(await perguntar("Alcance: "));
    let nova = new aeronave_1.default(codigo, modelo, tipo === "1" ? tipoAeronave_1.TipoAeronave.COMERCIAL : tipoAeronave_1.TipoAeronave.MILITAR, capacidade, alcance);
    aeronaves.push(nova);
    aeronaveAtual = nova;
    (0, fileManager_1.salvarLista)("aeronaves.json", aeronaves);
    console.log("Aeronave criada e selecionada!");
    menu();
}
function listarAeronaves() {
    if (aeronaves.length === 0) {
        console.log("Nenhuma aeronave cadastrada.");
        return menu();
    }
    console.log("\n--- Aeronaves ---");
    aeronaves.forEach((a, index) => {
        console.log(`[${index}] ${a.codigo} - ${a.modelo}`);
    });
    menu();
}
async function selecionarAeronave() {
    if (aeronaves.length === 0) {
        console.log("Nenhuma aeronave disponível.");
        return menu();
    }
    listarAeronaves();
    const index = Number(await perguntar("Escolha o índice: "));
    aeronaveAtual = aeronaves[index];
    console.log("Aeronave selecionada:", aeronaveAtual.codigo);
    menu();
}
// Peças
async function adicionarPeca() {
    if (!aeronaveAtual) {
        console.log("Selecione uma aeronave primeiro.");
        return menu();
    }
    const nome = await perguntar("Nome da peça: ");
    const tipo = await perguntar("Tipo (1-NACIONAL / 2-IMPORTADA): ");
    const fornecedor = await perguntar("Fornecedor: ");
    try {
        let peca = new peca_1.default(nome, tipo === "1" ? tipoPeca_1.TipoPeca.NACIONAL : tipoPeca_1.TipoPeca.IMPORTADA, fornecedor, statusPeca_1.StatusPeca.EM_PRODUCAO);
        aeronaveAtual.adicionarPeca(peca);
        (0, fileManager_1.salvarLista)("aeronaves.json", aeronaves);
        console.log("Peça adicionada!");
        aeronaveAtual.listarPecas();
    }
    catch (e) {
        console.log(e.message);
    }
    menu();
}
async function atualizarStatusPeca() {
    if (!aeronaveAtual) {
        console.log("Selecione uma aeronave primeiro.");
        return menu();
    }
    if (aeronaveAtual.pecas.length === 0) {
        console.log("Nenhuma peça cadastrada nessa aeronave.");
        return menu();
    }
    aeronaveAtual.listarPecas();
    const index = Number(await perguntar("Escolha o índice da peça: "));
    const peca = aeronaveAtual.pecas[index];
    if (!peca) {
        console.log("Peça não encontrada.");
        return menu();
    }
    try {
        peca.atualizarStatus();
        (0, fileManager_1.salvarLista)("aeronaves.json", aeronaves);
        console.log(`Status atualizado: ${peca.nome} → ${peca.status}`);
        aeronaveAtual.listarPecas();
    }
    catch (e) {
        console.log(e.message);
    }
    menu();
}
// Etapas
async function criarEtapa() {
    if (!aeronaveAtual) {
        console.log("Selecione uma aeronave primeiro.");
        return menu();
    }
    const nome = await perguntar("Nome da etapa: ");
    const prazo = await perguntar("Prazo: ");
    let etapa = new etapa_1.default(nome, prazo, statusEtapa_1.StatusEtapa.PENDENTE, []);
    aeronaveAtual.adicionarEtapa(etapa);
    (0, fileManager_1.salvarLista)("aeronaves.json", aeronaves);
    console.log("Etapa criada!");
    aeronaveAtual.listarEtapas();
    menu();
}
async function iniciarEtapa() {
    if (!aeronaveAtual) {
        console.log("Selecione uma aeronave primeiro.");
        return menu();
    }
    if (aeronaveAtual.etapas.length === 0) {
        console.log("Nenhuma etapa cadastrada.");
        return menu();
    }
    aeronaveAtual.listarEtapas();
    const index = Number(await perguntar("Escolha o índice da etapa para iniciar: "));
    try {
        aeronaveAtual.iniciarEtapa(index);
        (0, fileManager_1.salvarLista)("aeronaves.json", aeronaves);
        console.log("Etapa iniciada!");
        aeronaveAtual.listarEtapas();
    }
    catch (e) {
        console.log(e.message);
    }
    menu();
}
async function finalizarEtapa() {
    if (!aeronaveAtual) {
        console.log("Selecione uma aeronave primeiro.");
        return menu();
    }
    if (aeronaveAtual.etapas.length === 0) {
        console.log("Nenhuma etapa cadastrada.");
        return menu();
    }
    aeronaveAtual.listarEtapas();
    const index = Number(await perguntar("Escolha o índice da etapa para finalizar: "));
    try {
        aeronaveAtual.finalizarEtapa(index);
        (0, fileManager_1.salvarLista)("aeronaves.json", aeronaves);
        console.log("Etapa finalizada!");
        aeronaveAtual.listarEtapas();
    }
    catch (e) {
        console.log(e.message);
    }
    menu();
}
// Testes
async function adicionarTestes() {
    if (!aeronaveAtual) {
        console.log("Selecione uma aeronave primeiro.");
        return menu();
    }
    const tipoInput = await perguntar("Tipo (1-ELETRICO / 2-HIDRAULICO / 3-AERODINAMICO): ");
    const resultadoInput = await perguntar("Resultado (1-APROVADO / 2-REPROVADO): ");
    const tipo = tipoInput === "1" ? tipoTeste_1.TipoTeste.ELETRICO :
        tipoInput === "2" ? tipoTeste_1.TipoTeste.HIDRAULICO :
            tipoTeste_1.TipoTeste.AERODINAMICO;
    const resultado = resultadoInput === "1" ? resultadoTeste_1.ResultadoTeste.APROVADO :
        resultadoTeste_1.ResultadoTeste.REPROVADO;
    try {
        aeronaveAtual.adicionarTeste(new teste_1.default(tipo, resultado));
        (0, fileManager_1.salvarLista)("aeronaves.json", aeronaves);
        console.log("Teste adicionado!");
        aeronaveAtual.listarTestes();
    }
    catch (e) {
        console.log(e.message);
    }
    menu();
}
// Relatórios
async function gerarRelatorio() {
    if (!aeronaveAtual) {
        console.log("Selecione uma aeronave primeiro.");
        return menu();
    }
    const cliente = await perguntar("Cliente: ");
    const data = new Date().toLocaleDateString();
    try {
        let relatorio = new relatorio_1.default(cliente, data, aeronaveAtual);
        relatorio.gerarRelatorio(aeronaveAtual);
        relatorio.salvarRelatorio();
        console.log("Relatório gerado com sucesso!");
    }
    catch (e) {
        console.log(e.message);
    }
    menu();
}
// Funcionários
async function criarFuncionario() {
    if ((usuarioLogado === null || usuarioLogado === void 0 ? void 0 : usuarioLogado.nivelPermissao) !== nivelPermissao_1.NivelPermissao.ADMINISTRADOR) {
        console.log("Acesso negado. Apenas administradores podem criar funcionários.");
        return menu();
    }
    try {
        const id = await perguntar("ID: ");
        const nome = await perguntar("Nome: ");
        const telefone = await perguntar("Telefone: ");
        const endereco = await perguntar("Endereço: ");
        const usuario = await perguntar("Usuário: ");
        const senha = await perguntar("Senha: ");
        const nivel = await perguntar("Nível (1-ADMIN / 2-ENGENHEIRO / 3-OPERADOR): ");
        const funcionario = new funcionario_1.default(id, nome, telefone, endereco, usuario, senha, nivel === "1"
            ? nivelPermissao_1.NivelPermissao.ADMINISTRADOR
            : nivel === "2"
                ? nivelPermissao_1.NivelPermissao.ENGENHEIRO
                : nivelPermissao_1.NivelPermissao.OPERADOR);
        funcionario.salvarFuncionario();
        console.log("Funcionário criado com sucesso!");
    }
    catch (e) {
        console.log(e.message);
    }
    menu();
}
// Start
login();
