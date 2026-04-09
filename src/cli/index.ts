import fs from "fs"

import { NivelPermissao } from "../enums/nivelPermissao"

import Funcionario from "../models/funcionario"

// Limpar dados anteriores

const arquivos = ["aeronaves.json", "funcionarios.json", "relatorios.json"]

arquivos.forEach(arquivo => {
    if(fs.existsSync(arquivo)){
        fs.unlinkSync(arquivo)
    }
})

console.log("Arquivos anteriores removidos.\n")

// Criar funcionários

const admin = new Funcionario("1", "Admin", "123456789", "Rua dos admin, 1 - SJC", "admin", "admin123", NivelPermissao.ADMINISTRADOR)

const engenheiro = new Funcionario("2", "Engenheiro", "987654321", "Rua dos engenheiros, 2 - SJC", "engenheiro", "eng123", NivelPermissao.ENGENHEIRO)

const operador = new Funcionario("3", "Operador", "111111111", "Rua dos operadores, 3 - SJC", "operador", "op123", NivelPermissao.OPERADOR)

admin.salvarFuncionario()
engenheiro.salvarFuncionario()
operador.salvarFuncionario()

console.log("Funcionários criados:")
console.log(`${admin.nome} | Nível: ${admin.nivelPermissao} | Usuário: admin / Senha: admin`)
console.log(`${engenheiro.nome} | Nível: ${engenheiro.nivelPermissao} | Usuário: engenheiro / Senha: eng`)
console.log(`${operador.nome} | Nível: ${operador.nivelPermissao} | Usuário: operador / Senha: op`)

console.log("\nAmbiente pronto. Execute o menu para continuar.\n")