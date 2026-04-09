import fs from "fs";

export function lerArquivo<T>(caminho: string): T[] {
    try {
        if (!fs.existsSync(caminho)) {
            return [];
        }
        const dados = fs.readFileSync(caminho, "utf-8");

        if (!dados.trim()) {
            return [];
        }

        return JSON.parse(dados);
    } catch (erro) {
        console.error("Erro ao ler arquivo:", erro);
        return [];
    }
}