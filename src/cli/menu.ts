import readline from "readline"
import { TipoAeronave } from "../enums/tipoAeronave"
import { TipoPeca } from "../enums/tipoPeca"
import { StatusPeca } from "../enums/statusPeca"
import { StatusEtapa } from "../enums/statusEtapa"
import { TipoTeste } from "../enums/tipoTeste"
import { ResultadoTeste } from "../enums/resultadoTeste"
import { NivelPermissao } from "../enums/nivelPermissao"
import Aeronave from "../models/aeronave"
import Peca from "../models/peca"
import Etapa from "../models/etapa"
import Teste from "../models/teste"
import Funcionario from "../models/funcionario"
import Relatorio from "../models/relatorio"
import { lerArquivo } from "../services/readManager"
import { salvarLista } from "../services/fileManager"
import salvarObjeto from "../services/objectManager"

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

let usuarioLogado: any = null

// Reconstrói os objetos aninhados ao carregar do arquivo
let aeronaves: Aeronave[] = (lerArquivo("aeronaves.json") || []).map((a: any) => {
    const aeronave = new Aeronave(a.codigo, a.modelo, a.tipo, a.capacidade, a.alcance)
    aeronave.pecas = (a.pecas || []).map((p: any) => new Peca(p.nome, p.tipo, p.fornecedor, p.status))
    aeronave.etapas = (a.etapas || []).map((e: any) => new Etapa(e.nome, e.prazo, e.status, e.funcionarios || []))
    aeronave.testes = (a.testes || []).map((t: any) => new Teste(t.tipo, t.resultado))
    return aeronave
})

let aeronaveAtual: Aeronave | null = null

function perguntar(pergunta: string): Promise<string>{
    return new Promise(resolve => rl.question(pergunta, resolve))
}

// Login

async function login(){
    console.log("\n--- LOGIN ---")

    const usuario = await perguntar("Usuário: ")
    const senha = await perguntar("Senha: ")

    try{
        usuarioLogado = Funcionario.autenticar(usuario, senha)
        console.log(`\nBem-vindo, ${usuarioLogado.nome}`)
        menu()
    }catch(e: any){
        console.log(e.message)
        login()
    }
}

// Menu

async function menu(){
    console.log(`
--- MENU ---
Usuário: ${usuarioLogado?.nome || "Nenhum"} (${usuarioLogado?.nivelPermissao || ""})
Aeronave atual: ${aeronaveAtual?.codigo || "Nenhuma"}

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
`)

    const opcao = await perguntar("Escolha: ")

    switch(opcao){
        case "1": await criarAeronave(); break
        case "2": listarAeronaves(); break
        case "3": await selecionarAeronave(); break
        case "4": await adicionarPeca(); break
        case "5": await atualizarStatusPeca(); break
        case "6": await criarEtapa(); break
        case "7": await iniciarEtapa(); break
        case "8": await finalizarEtapa(); break
        case "9": await adicionarTestes(); break
        case "10": await gerarRelatorio(); break
        case "11": await criarFuncionario(); break
        case "0": rl.close(); break
        default: menu()
    }
}


// Aeronaves

async function criarAeronave(){
    const codigo = await perguntar("Código: ")

    if(aeronaves.some(a => a.codigo === codigo)){
        console.log("Já existe uma aeronave com esse código.")
        return menu()
    }

    const modelo = await perguntar("Modelo: ")
    const tipo = await perguntar("Tipo (1-COMERCIAL / 2-MILITAR): ")
    const capacidade = Number(await perguntar("Capacidade: "))
    const alcance = Number(await perguntar("Alcance: "))

    let nova = new Aeronave(
        codigo,
        modelo,
        tipo === "1" ? TipoAeronave.COMERCIAL : TipoAeronave.MILITAR,
        capacidade,
        alcance
    )

    aeronaves.push(nova)
    aeronaveAtual = nova

    salvarLista("aeronaves.json", aeronaves)

    console.log("Aeronave criada e selecionada!")
    menu()
}

function listarAeronaves(){
    if(aeronaves.length === 0){
        console.log("Nenhuma aeronave cadastrada.")
        return menu()
    }

    console.log("\n--- Aeronaves ---")

    aeronaves.forEach((a, index) => {
        console.log(`[${index}] ${a.codigo} - ${a.modelo}`)
    })

    menu()
}

async function selecionarAeronave(){
    if(aeronaves.length === 0){
        console.log("Nenhuma aeronave disponível.")
        return menu()
    }

    listarAeronaves()

    const index = Number(await perguntar("Escolha o índice: "))
    aeronaveAtual = aeronaves[index]

    console.log("Aeronave selecionada:", aeronaveAtual.codigo)

    menu()
}

// Peças

async function adicionarPeca(){
    if(!aeronaveAtual){
        console.log("Selecione uma aeronave primeiro.")
        return menu()
    }

    const nome = await perguntar("Nome da peça: ")
    const tipo = await perguntar("Tipo (1-NACIONAL / 2-IMPORTADA): ")
    const fornecedor = await perguntar("Fornecedor: ")

    try{
        let peca = new Peca(
            nome,
            tipo === "1" ? TipoPeca.NACIONAL : TipoPeca.IMPORTADA,
            fornecedor,
            StatusPeca.EM_PRODUCAO
        )

        aeronaveAtual.adicionarPeca(peca)
        salvarLista("aeronaves.json", aeronaves)

        console.log("Peça adicionada!")
        aeronaveAtual.listarPecas()
    }catch(e: any){
        console.log(e.message)
    }

    menu()
}

async function atualizarStatusPeca(){
    if(!aeronaveAtual){
        console.log("Selecione uma aeronave primeiro.")
        return menu()
    }

    if(aeronaveAtual.pecas.length === 0){
        console.log("Nenhuma peça cadastrada nessa aeronave.")
        return menu()
    }

    aeronaveAtual.listarPecas()

    const index = Number(await perguntar("Escolha o índice da peça: "))
    const peca = aeronaveAtual.pecas[index]

    if(!peca){
        console.log("Peça não encontrada.")
        return menu()
    }

    try{
        peca.atualizarStatus()
        salvarLista("aeronaves.json", aeronaves)

        console.log(`Status atualizado: ${peca.nome} → ${peca.status}`)
        aeronaveAtual.listarPecas()
    }catch(e: any){
        console.log(e.message)
    }

    menu()
}

// Etapas

async function criarEtapa(){
    if(!aeronaveAtual){
        console.log("Selecione uma aeronave primeiro.")
        return menu()
    }

    const nome = await perguntar("Nome da etapa: ")
    const prazo = await perguntar("Prazo: ")

    let etapa = new Etapa(nome, prazo, StatusEtapa.PENDENTE, [])

    aeronaveAtual.adicionarEtapa(etapa)

    salvarLista("aeronaves.json", aeronaves)

    console.log("Etapa criada!")
    aeronaveAtual.listarEtapas()

    menu()
}

async function iniciarEtapa(){
    if(!aeronaveAtual){
        console.log("Selecione uma aeronave primeiro.")
        return menu()
    }

    if(aeronaveAtual.etapas.length === 0){
        console.log("Nenhuma etapa cadastrada.")
        return menu()
    }

    aeronaveAtual.listarEtapas()

    const index = Number(await perguntar("Escolha o índice da etapa para iniciar: "))

    try{
        aeronaveAtual.iniciarEtapa(index)
        salvarLista("aeronaves.json", aeronaves)

        console.log("Etapa iniciada!")
        aeronaveAtual.listarEtapas()
    }catch(e: any){
        console.log(e.message)
    }

    menu()
}

async function finalizarEtapa(){
    if(!aeronaveAtual){
        console.log("Selecione uma aeronave primeiro.")
        return menu()
    }

    if(aeronaveAtual.etapas.length === 0){
        console.log("Nenhuma etapa cadastrada.")
        return menu()
    }

    aeronaveAtual.listarEtapas()

    const index = Number(await perguntar("Escolha o índice da etapa para finalizar: "))

    try{
        aeronaveAtual.finalizarEtapa(index)
        salvarLista("aeronaves.json", aeronaves)

        console.log("Etapa finalizada!")
        aeronaveAtual.listarEtapas()
    }catch(e: any){
        console.log(e.message)
    }

    menu()
}

// Testes

async function adicionarTestes(){
    if(!aeronaveAtual){
        console.log("Selecione uma aeronave primeiro.")
        return menu()
    }

    const tipoInput = await perguntar("Tipo (1-ELETRICO / 2-HIDRAULICO / 3-AERODINAMICO): ")
    const resultadoInput = await perguntar("Resultado (1-APROVADO / 2-REPROVADO): ")

    const tipo =
        tipoInput === "1" ? TipoTeste.ELETRICO :
        tipoInput === "2" ? TipoTeste.HIDRAULICO :
        TipoTeste.AERODINAMICO

    const resultado =
        resultadoInput === "1" ? ResultadoTeste.APROVADO :
        ResultadoTeste.REPROVADO

    try{
        aeronaveAtual.adicionarTeste(new Teste(tipo, resultado))
        salvarLista("aeronaves.json", aeronaves)

        console.log("Teste adicionado!")
        aeronaveAtual.listarTestes()
    }catch(e: any){
        console.log(e.message)
    }

    menu()
}

// Relatórios

async function gerarRelatorio(){
    if(!aeronaveAtual){
        console.log("Selecione uma aeronave primeiro.")
        return menu()
    }

    const cliente = await perguntar("Cliente: ")
    const data = new Date().toLocaleDateString()

    try{
        let relatorio = new Relatorio(cliente, data, aeronaveAtual)

        relatorio.gerarRelatorio(aeronaveAtual)
        relatorio.salvarRelatorio()

        console.log("Relatório gerado com sucesso!")
    }catch(e: any){
        console.log(e.message)
    }

    menu()
}

// Funcionários

async function criarFuncionario(){
    if(usuarioLogado?.nivelPermissao !== NivelPermissao.ADMINISTRADOR){
        console.log("Acesso negado. Apenas administradores podem criar funcionários.")
        return menu()
    }

    try{
        const id = await perguntar("ID: ")
        const nome = await perguntar("Nome: ")
        const telefone = await perguntar("Telefone: ")
        const endereco = await perguntar("Endereço: ")
        const usuario = await perguntar("Usuário: ")
        const senha = await perguntar("Senha: ")
        const nivel = await perguntar("Nível (1-ADMIN / 2-ENGENHEIRO / 3-OPERADOR): ")

        const funcionario = new Funcionario(
            id,
            nome,
            telefone,
            endereco,
            usuario,
            senha,
            nivel === "1"
                ? NivelPermissao.ADMINISTRADOR
                : nivel === "2"
                ? NivelPermissao.ENGENHEIRO
                : NivelPermissao.OPERADOR
        )

        funcionario.salvarFuncionario()

        console.log("Funcionário criado com sucesso!")
    }catch(e: any){
        console.log(e.message)
    }

    menu()
}

// Start

login()