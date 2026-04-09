import fs from "fs";

export default function salvarArquivo<T>(caminho: string, valor: T): void{
    let dados: T[] = []
    if(fs.existsSync(caminho)){
        const conteudo = fs.readFileSync(caminho, 'utf-8')
        dados = JSON.parse(conteudo)
    }
    dados.push(valor)

    fs.writeFileSync(caminho, JSON.stringify(dados, null, 2))
}

export function salvarLista<T>(caminho: string, lista: T[]): void{
    fs.writeFileSync(caminho, JSON.stringify(lista, null, 2))
}