import Funcionario from "../models/funcionario";
import salvarArquivo from "./fileManager";

export default function salvarObjeto(objeto: any){
    let arquivo = ""

    if(objeto instanceof Funcionario){
        arquivo = "funcionarios.json"
    }
    else{
        throw new Error("Tipo inválido")
    }

    salvarArquivo(arquivo, objeto)
}