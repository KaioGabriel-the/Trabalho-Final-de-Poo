import Interacao from "./interacao";
import Perfil from "./perfil";
import Publicacao from "./publicacao";
export default class PublicacaoAvancada extends Publicacao {
    private _interacoes: Interacao[] = [];

    constructor(conteudo: string, perfil: Perfil, id? :string) {
        super(conteudo, perfil, id);
    }
    public get interacoes(): Interacao[] {
        return this._interacoes;
    }

    public addInteracao(interacao: Interacao): void {
        this._interacoes.push(interacao);
    }

    public exibir(): void {
        super.exibir();
        console.log(`Interacoes: ${this.interacoes.length}\n`)
    }
}