import Interacao from "./interacao";
import Perfil from "./perfil";
import Publicacao from "./publicacao";
export default class PublicacaoAvancada extends Publicacao {
    private _interacoes: Interacao[] = [];

    constructor(conteudo: string, perfil: Perfil) {
        super(conteudo, perfil);
    }
    public get interacoes(): Interacao[] {
        return this._interacoes;
    }

    public addInteracao(interacao: Interacao): void {
        this._interacoes.push(interacao);
    }
}