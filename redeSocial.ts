import Interacao from "./entities/interacao";
import Perfil from "./entities/perfil";
import PerfilAvancado from "./entities/perfilAvancado";
import Publicacao from "./entities/publicacao";
import PublicacaoAvancada from "./entities/publicacaoAvancada";
import { SolicitacaoInvalidaError, SolicitacaoNaoEncontradaError } from "./exceptions/excecoesAmizade";
import { PerfilJaCadastradoError, PerfilNaoAutorizadoError, PerfilNaoEncontradoError } from "./exceptions/excecoesPerfil";
import { PublicacaoInvalidaError, PublicacaoNaoEncontradaError } from "./exceptions/excecoesPublicacao";


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

    public carregarPropriedades(props: any): void {
        this._perfis = props.perfis;
        this._publicacoes = props.publicacoes;
        this._solicitacoes = props.solicitacoes;
    }

    public adicionarPerfil(perfil: Perfil): void {
        this._perfis.push(perfil);
    }

    public buscarPerfilPorId(id: string): Perfil {
        const perfilEncontrado = this._perfis.find((perfilProcurado) => perfilProcurado.id === id);
        if (!perfilEncontrado) {
            throw new PerfilNaoEncontradoError(`Perfil com id ${id} não encontrado.`);
        }

        return perfilEncontrado;
    }

    public buscarPerfilPorEmail(email: string): Perfil | undefined {
        const perfilEncontrado = this._perfis.find(perfil => perfil.email === email);
        if (!perfilEncontrado) {
            throw new PerfilNaoEncontradoError(`Perfil com email ${email} não encontrado...`);  
        }

        return perfilEncontrado;
    }

    public buscarPerfilPorApelido(apelido: string): Perfil {
        const perfilEncontrado = this._perfis.find(perfil => perfil.apelido === apelido);
        if(!perfilEncontrado){
            throw new PerfilNaoEncontradoError(`Perfil com apelido ${apelido} não encontrado...`);
        }

        return perfilEncontrado;
    }

    public ativarPerfil(ativadorId: string, perfilId: string ): void {
        const ativador: Perfil = this.buscarPerfilPorId(ativadorId);
        const perfil: Perfil = this.buscarPerfilPorId(perfilId);

        if (!(ativador instanceof PerfilAvancado)) {
            throw new PerfilNaoAutorizadoError;
        }

        ativador.habilitarPerfil(perfil);
    }

    public desativarPerfil(ativadorId: string, perfilId: string): void {
        const ativador: Perfil = this.buscarPerfilPorId(ativadorId);
        const perfil: Perfil = this.buscarPerfilPorId(perfilId);

        if (!(ativador instanceof PerfilAvancado)) {
            throw new PerfilNaoAutorizadoError;
        }

        ativador.habilitarPerfil(perfil);
    }


    public adicionarPublicacao(publicacao: Publicacao): void {
        this._publicacoes.push(publicacao);
    }

    public buscarPublicacaoDeUmUsuarioPorId(id: string, perfil: Perfil): Publicacao {
        const publicacaoEncontrada = this._publicacoes.find((publicacaoProcurada) => publicacaoProcurada.id === id && publicacaoProcurada.perfil === perfil);

        if (!publicacaoEncontrada) {
            throw new PublicacaoNaoEncontradaError(`Publicação com id ${id} não encontrada para esse perfil.`);
        }

        return publicacaoEncontrada;
    }
    public enviarSolicitacao(apelidoEmissor: string, apelidoReceptor: string): void {
        const emissor = this.buscarPerfilPorApelido(apelidoEmissor);
        const receptor = this.buscarPerfilPorApelido(apelidoReceptor);

        if (!this._solicitacoes.has(receptor)) {
            this._solicitacoes.set(receptor, []);
        }

        this._solicitacoes.get(receptor)!.push(emissor);
    }

    // Retorna true se existir pelo menos uma solicitação para o receptor
    public existeSolicitacaoReceptor(receptor: Perfil): boolean {
        return this._solicitacoes.has(receptor);
    }

    // Retorna true se, para um receptor, o emissor ja enviou uma solicitação
    public existeSolicitacaoEmissor(solicitacoes: Perfil[], emissor: Perfil): boolean {
        return solicitacoes.find(em => em.id === emissor.id) !== undefined;
    }

    public removerSolicitacao(emissor: Perfil, receptor: Perfil): void {
        // Busca a solicitação e remove o emissor da lista de solicitantes
        const solicitacoesAtlz = this._solicitacoes.get(receptor)!.filter(em => em.id !== emissor.id);
        this._solicitacoes.set(receptor, solicitacoesAtlz); // Atualiza a lista para um receptor
    }


    public aceitarSolicitacao(apelidoEmissor: string, apelidoReceptor: string): void {
        const emissor: Perfil = this.buscarPerfilPorApelido(apelidoEmissor);
        const receptor: Perfil = this.buscarPerfilPorApelido(apelidoReceptor);
        if (this.existeSolicitacaoReceptor(receptor) === false) {
            throw new SolicitacaoNaoEncontradaError("Nenhuma solicitação encontrada para este receptor!");
        }
    
        if (!this.existeSolicitacaoEmissor(this._solicitacoes.get(receptor)!, emissor)) {
            throw new SolicitacaoInvalidaError("Solicitação inválida!");
        }
        
        emissor.adicionarAmigo(receptor);
    }

    public rejeitarSolicitacao(apelidoEmissor: string, apelidoReceptor: string): void {

        const emissor: Perfil = this.buscarPerfilPorApelido(apelidoEmissor);
        const receptor: Perfil = this.buscarPerfilPorApelido(apelidoReceptor);

        if (!this.existeSolicitacaoReceptor(receptor)) {
            throw new SolicitacaoNaoEncontradaError("Nenhuma solicitação encontrada para esse receptor!");
        }
    
        if (!this.existeSolicitacaoEmissor(this._solicitacoes.get(receptor)!, emissor)) {
            throw new SolicitacaoInvalidaError("Solicitação inválida!");
        }

        this.removerSolicitacao(emissor, receptor);
    }

    public existeInteracao(perfil: Perfil, publicacao: PublicacaoAvancada): boolean {
        return publicacao.interacoes.find(interacao => interacao.id === perfil.id) !== undefined;
    }
    
    public adicionarInteracao(publicacao: Publicacao, perfil: Perfil, interacao: Interacao): void {

        if (!(publicacao instanceof PublicacaoAvancada)){
            throw new PublicacaoInvalidaError("Publicação inválida para adicionar interações!");
        }

        if (this.existeInteracao(perfil, publicacao)) {
            throw new Error("Interação já existe para esse usuário!");
        }

        publicacao.addInteracao(interacao);
    }

    public exibirPublicacoesOrdenadas(perfil?: Perfil): void {
        let pubs : Publicacao[] = this._publicacoes;

        if (perfil){
            pubs = pubs.filter(pub => pub.perfil.id === perfil.id);
        }
        
        pubs.sort((a, b) => b.data.getTime() - a.data.getTime());
        pubs.forEach(publicacao => publicacao.exibir());
    }

    public verificarNovoCadastro(novoCadastroApelido: string): void {
        if (this._perfis.find(perfil => perfil.apelido === novoCadastroApelido) !== undefined) {
            throw new PerfilJaCadastradoError;
        }
    }
}