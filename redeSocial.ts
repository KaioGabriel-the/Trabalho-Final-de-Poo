import Perfil from "./entities/perfil";
import PerfilAvancado from "./entities/perfilAvancado";
import Publicacao from "./entities/publicacao";

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
    ▪ Aceitar solicitações; 
    ▪ Recusar solicitações. 
o Gerenciamento de Interações: 
    ▪ Adicionar interações a publicações avançadas, garantindo que um usuário não 
    interaja mais de uma vez na mesma publicação. 
    
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


    public adicionarPublicacao(conteudo: string, perfilId: string): void {
        const perfil : Perfil | undefined = this.buscarPerfilPorId(perfilId);
        if (!perfil) {
            throw new Error("Perfil inválido.");
        }
        const publicacao = new Publicacao(conteudo, perfil);
        this._publicacoes.push(publicacao);
    }
    
    public enviarSolicitacao(emissorId: string, receptorId: string): void {
        const emissor: Perfil | undefined = this.buscarPerfilPorId(emissorId);
        const receptor: Perfil | undefined = this.buscarPerfilPorId(receptorId);
        if (!emissor || !receptor) {
            throw new Error("Emissor ou receptor inválidos!");
        }

        if (!this._solicitacoes.has(receptor)) {
            this._solicitacoes.set(receptor, []);
        }

        this._solicitacoes.get(receptor)!.push(emissor);
    }

    public aceitarSolicitacao(emissorId: string, receptorId: string): void {
        const emissor: Perfil | undefined = this.buscarPerfilPorId(emissorId);
        const receptor: Perfil | undefined = this.buscarPerfilPorId(receptorId);
        if (!emissor || !receptor) {
            throw new Error("Emissor ou receptor inválidos!");
        }
    
        if (!this._solicitacoes.has(receptor)) {
            throw new Error("Nenhuma solicitação encontrada!");
        }
    
        if (!this._solicitacoes.get(receptor)?.find(em => em.id === emissorId)) {
            throw new Error("Solicitação inválida!");
        }
        
        emissor.adicionarAmigo(receptor);
    }
            
}