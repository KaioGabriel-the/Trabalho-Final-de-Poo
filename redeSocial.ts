import Interacao from "./entities/interacao";
import Perfil from "./entities/perfil";
import PerfilAvancado from "./entities/perfilAvancado";
import Publicacao from "./entities/publicacao";
import PublicacaoAvancada from "./entities/publicacaoAvancada";

/*2) Implementação da Classe RedeSocial (2,0 pontos) 
 
• Atributos: 
    o Array de perfis cadastrados;  x
    o Array de todas as publicações da rede social;  x
    o Mapa solicitações de amizade pendentes (map<Perfil, Perfil>  x
• Métodos: 
o Gerenciamento de Perfis: 
    ▪ Adicionar perfil; x
    ▪ Buscar perfil por email, apelido ou id; x
    ▪ Listar todos os perfis;  x
    ▪ Ativar/desativar perfil por meio de perfil avançado. x
o Gerenciamento de Publicações: 
    ▪ Adicionar publicação simples ou avançada associadas a perfis;  x
    ▪ Listar publicações ordenadas em ordem decrescente, podendo ser filtradas por 
    perfil. ?
o Gerenciamento de solicitacoes: 
    ▪ Enviar solicitações de amizade; X
    ▪ Aceitar solicitações; X
    ▪ Recusar solicitações.  X
o Gerenciamento de Interações: 
    ▪ Adicionar interações a publicações avançadas, garantindo que um usuário não 
    interaja mais de uma vez na mesma publicação.  X
    
    Nessa  classe,  devem  ser  passados  aos  métodos  preferencialmente  ids,  apelidos,  e-mails  ou 
    outros atributos únicos. Daí os objetos são consultados nos arrays e a partir daí serão manipulados*/
export default class RedeSocial {
    private _perfis: Perfil[] = [];
    private _publicacoes: Publicacao[] = [];

    // Consideremos que a chave é o receptor da solicitacao, o valor são os emissores
    private _solicitacoes: Map<Perfil, Perfil[]> = new Map<Perfil, Perfil[]>();

    public get perfis(): Perfil[] {
        return this._perfis;
    }

    public get publicacoes(): Publicacao[] {
        return this._publicacoes;
    }

    public get solicitacoes(): Map<Perfil, Perfil[]> {
        return this._solicitacoes;
    }

    public adicionarPerfil(perfil: Perfil): void {
        this._perfis.push(perfil);
    }

    public buscarPerfilPorId(id: string): Perfil | undefined {
        return this._perfis.find(perfil => perfil.id === id);
    }

    public buscarPerfilPorEmail(email: string): Perfil | undefined {
        return this._perfis.find(perfil => perfil.email === email);
    }

    public buscarPerfilPorApelido(apelido: string): Perfil | undefined {
        return this._perfis.find(perfil => perfil.apelido === apelido);
    }

    public ativarPerfil(avancado: Perfil, perfil: Perfil): void {
        if (avancado instanceof PerfilAvancado) {
            avancado.habilitarPerfil(perfil);
        }
    }

    public desativarPerfil(avancado: Perfil, perfil: Perfil): void {
        if (avancado instanceof PerfilAvancado) {
            avancado.desabilitarPerfil(perfil);
        }
    }


    public adicionarPublicacao(conteudo: string, perfil: Perfil): void {
        const publicacao = new Publicacao(conteudo, perfil);
        this._publicacoes.push(publicacao);
    }
    
    public enviarSolicitacao(emissor: Perfil, receptor: Perfil): void {
        if (!this._solicitacoes.has(receptor)) {
            this._solicitacoes.set(receptor, []);
        }

        this._solicitacoes.get(receptor)!.push(emissor);
    }

    private existeSolicitacaoReceptor(receptor: Perfil): boolean {
        return this._solicitacoes.has(receptor);
    }

    private existeSolicitacaoEmissor(solicitacoes: Perfil[], emissor: Perfil): boolean {
        return solicitacoes.find(em => em.id === emissor.id) !== undefined;
    }

    public removerSolicitacao(emissor: Perfil, receptor: Perfil): void {
        const solicitacoesAtlz = this._solicitacoes.get(receptor)!.filter(em => em.id !== emissor.id);
        this._solicitacoes.set(receptor, solicitacoesAtlz);
    }

    public aceitarSolicitacao(emissor: Perfil, receptor: Perfil): void {
        if (this.existeSolicitacaoReceptor(receptor) === false) {
            throw new Error("Nenhuma solicitação encontrada para este receptor!");
        }
    
        if (!this.existeSolicitacaoEmissor(this._solicitacoes.get(receptor)!, emissor)) {
            throw new Error("Solicitação inválida!");
        }
        
        emissor.adicionarAmigo(receptor);
    }

    public rejeitarSolicitacao(emissor: Perfil, receptor: Perfil): void {
        if (!this.existeSolicitacaoReceptor(receptor)) {
            throw new Error("Nenhuma solicitação encontrada!");
        }
    
        if (!this.existeSolicitacaoEmissor(this._solicitacoes.get(receptor)!, emissor)) {
            throw new Error("Solicitação inválida!");
        }

        this.removerSolicitacao(emissor, receptor);
    }

    public existeInteracao(perfil: Perfil, publicacao: PublicacaoAvancada): boolean {
        return publicacao.interacoes.find(interacao => interacao.id === perfil.id) !== undefined;
    }
    
    public adicionarInteracao(publicacao: Publicacao, perfil: Perfil, interacao: Interacao): void {

        if (!(publicacao instanceof PublicacaoAvancada)){
            throw new Error("Publicação inválida para adicionar interações!");
        }

        if (this.existeInteracao(perfil, publicacao)) {
            throw new Error("Interação já existente!");
        }

        publicacao.addInteracao(interacao);
    }

    public exibirPublicacoesOrdenadas(perfil?: Perfil): void {
        let pubs : Publicacao[] = this._publicacoes;

        if (perfil){
            pubs = pubs.filter(pub => pub.perfil.id === perfil.id)
        }
        
        pubs.sort((a, b) => b.data.getTime() - a.data.getTime());
        pubs.forEach(publicacao => publicacao.exibir());
    }
}