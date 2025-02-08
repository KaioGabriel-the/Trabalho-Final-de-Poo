import prompt from "prompt-sync";
import RedeSocial from "../redeSocial";
import Perfil from "../entities/perfil";
import PerfilAvancado from "../entities/perfilAvancado";
import Publicacao from "../entities/publicacao";
import { cls, enter } from "../utils/utils";
import AppError from "../exceptions/appExcecao";
import { PublicacaoNaoEncontradaError } from "../exceptions/excecoesPublicacao";

class App {
    private _input: prompt.Prompt;
    private _redeSocial: RedeSocial;

    constructor() {
        this._input = prompt();
        this._redeSocial = new RedeSocial();
    }

    public menu(): void {
        let opcao: number = -1;

        const menuOpcoes: String =
            " ----- REDE SOCIAL -----" +
            "\n" +
            "1 - Criar Perfil\n" +
            "2 - Entrar em Perfil\n" +
            "3 - Criar Perfil Avançado\n" +
            "4 - Entrar em Perfil Avançado\n" +
            "5 - Feed de Publicações;\n";
        try {    
            do {
                console.log(menuOpcoes);
                opcao = Number(this._input("Digite a opção que deseja: "));
                cls();
                switch (opcao) {
                    case 1:
                        this.criarPerfil();
                        break;
                    case 2:
                        this.visualizarPerfil();
                        break;
                    case 3:
                        this.criarPerfilAvancado();
                        break;
                    case 4:
                        this.vizualizarPerfilAvancado();
                        break;
                    case 5:
                        this.exibirFeed();
                        break;
                }
            } while (opcao != 0);

        } catch (error) {
            if (error instanceof AppError) {
                console.log("Erro! " + error.message);
            }
            
            else {
                console.log("Erro inesperado! Contate o suporte.");
            }
        }
    }

    private menuEmoji(): string {
        let menu: string =
            "----- Menu de emojis -----\n" +
            "0 - 😁 \n1 - 😉 \n2 - 😇 \n3 - 🙃 \n4 - 😷\n";
        console.log(menu);
        let emoji = Number(this._input("Escolha sua foto de perfil: "));
        let arrayEmoji = ["😁", "😉", "😇", "🙃", "😷"];
        return arrayEmoji[emoji];
    }

    private criarPerfil(): void {
        console.log("----- Criando Perfil ----- \n");

        let nomeUsuario = this._input("--> Digite o seu nome de usuario: ");
        this._redeSocial.verificarNovoCadastro(nomeUsuario);
        enter();
        cls();

        let fotoPerfil = this.menuEmoji();
        enter();
        cls();

        let emailUsuario = this._input("--> Digite o seu email: ");
        enter();
        cls();
        let novoPerfil: Perfil = new Perfil(
            nomeUsuario,
            fotoPerfil,
            emailUsuario
        );

        this._redeSocial.adicionarPerfil(novoPerfil);

        console.log("Perfil criado com sucesso 🚀🚀🚀");
        console.log(novoPerfil.toString());

        enter();
        cls();
    }

    // TODO: Adicionar funcionalidade para perfil avancado 
    private visualizarPerfil(): void {
        const nomePerfil = this._input("Digite o NOME do seu perfil --> ");
        const usuario = this._redeSocial.buscarPerfilPorApelido(nomePerfil);
        const menu =
            `--> ${usuario.apelido} <---\n\n` +
            `--> Opções: \n` +
            `--> 1 - Criar Publicação;\n` +
            "--> 2 - Minhas Publicações;\n" +
            "--> 3 - Editar Publicação;\n" +
            "--> 4 - Remover Publicação;\n" +
            `--> 5 - Adicionar Amigo;\n` +
            "--> 6 - Amigos;\n" +
            "--> 7 - Solicitações;\n" +
            "--> 8 - Ativar/Desativar Perfil;\n" +
            "--> 0 - Voltar";

        let opcao: Number = -1;
        do {
            console.log(menu);
            opcao = Number(this._input("--> Qual opção deseja?: "));
            cls();
            switch (opcao) {
                case 1:
                    this.criarPublicacao(usuario);
                    break;
                case 2:
                    this.exibirMinhasPublicacoes(usuario);
                    break;
                case 3:
                    this.editarPublicacao(usuario);
                    break;
                case 4:
                    this.removerPublicacao(usuario);
                    break;
                case 5:
                    this.adicionarAmigo(usuario);
                    break;
                case 6:
                    this.exibirAmigos(usuario);
                    break;
                case 7:
                    this.exibirSolicitacoes(usuario);
                    break;
                case 8:
                    this.statusPerfil(usuario);
                    break;
            }
        } while (opcao != 0);
    }

    private criarPublicacao(usuario: Perfil): void {
        let textPublicacao = this._input("--> Escrevar sua publicação: ");
        enter();
        cls();
        this._redeSocial.adicionarPublicacao(textPublicacao, usuario);
        console.log("Publicação feita com sucesso");
        enter();
        cls();
    }

    private enviarSolicitacao(emissor: Perfil): void {
        let nomeReceptor : string = this._input("Digite o nome do perfil para solicitar amizade: ");
        this._redeSocial.enviarSolicitacao(emissor.apelido, nomeReceptor);

        console.log("Solicitação enviada com sucesso!!!");
    }

    private recusarSolicitacao(receptor: Perfil): void {
        let nomeEmissor = this._input("Digite o nome do perfil que deseja aceitar a solicitação: ");
        this._redeSocial.rejeitarSolicitacao(nomeEmissor, receptor.apelido);

        console.log("Solicitação recusada com sucesso...");
    }

    private aceitarSolocitacao(receptor: Perfil): void {
        let nomeEmissor = this._input("Digite o nome do perfil que deseja aceitar a solicitação: ");
        this._redeSocial.aceitarSolicitacao(nomeEmissor, receptor.apelido);

        console.log("Solicitação aceita com sucesso...");
    }

    private statusDaSolicitacao(receptor: Perfil): void {
        let menu: String =
            "----- Status da Solicitação ----- \n" +
            "--> 1 - Aceitar Solicitação \n" +
            "--> 2 - Recusar Solicitação \n" +
            "--> 3 - Enviar Solicitação";
        console.log(menu);

        let opcao = Number(this._input("--> Digite sua escolha: "));
        switch (opcao) {
            case 1:
                this.aceitarSolocitacao(receptor);
                break;
            case 2:
                this.recusarSolicitacao(receptor);
                break;
            case 3:
                this.enviarSolicitacao(receptor);
                break;
            default:
                console.log("--> Você digitou uma opção inválida...");
                break;
        }
    }

    // TODO: Testar
    private exibirSolicitacoes(usuario: Perfil): void {

        let solicitacoes = this._redeSocial.solicitacoes;

        if (this._redeSocial.existeSolicitacaoReceptor(usuario)) {
            let listaSolicitacoes = solicitacoes.get(usuario);

            if (listaSolicitacoes && listaSolicitacoes.length > 0) {
                console.log("--> Solicitações: ");
                listaSolicitacoes.forEach(perfil => console.log(`- ${perfil.apelido}`))
                this.statusDaSolicitacao(usuario);

            } else {
                console.log("Não há solicitações pendentes...");
            }
        } else {
            console.log("Não solicitações para esse perfil...");
        }

    }

    // TODO: Refatorar para que a criacao de um id avancado seja no mesmo metodo que o normal
    private criarPerfilAvancado(): void {
        console.log("----- Criando Perfil ----- \n");
        
        let nomeUsuario = this._input("--> Digite o seu nome de usuario: ");
        enter();
        cls();

        let fotoPerfil: string = this.menuEmoji();
        enter();
        cls();

        let emailUsuario = this._input("--> Digite o seu email: ");
        enter();
        cls();

        let perfilAvancado = new PerfilAvancado(
            nomeUsuario,
            fotoPerfil,
            emailUsuario
        );
        this._redeSocial.adicionarPerfil(perfilAvancado);
        console.log("Perfil avançado criado com sucesso...");
        enter();
        cls();
    }


    private exibirMinhasPublicacoes(usuario: Perfil): void {
        this._redeSocial.exibirPublicacoesOrdenadas(usuario);
        enter();
        cls();
    }

    private exibirAmigos(usuario: Perfil): void {
        const amigos = usuario.amigos;
        amigos.forEach((amigo) => {
            console.log(`${amigo.toString()}\n`);
        });
        enter();
        cls();
    }

    private editarPublicacao(usuario: Perfil): void {
        let idPublicacao = this._input("--> Digite o ID da publicação que deseja editar: ");
        enter();
        cls();

        let publicacao: Publicacao | undefined =
            this._redeSocial.publicacoes.find((publicacao) => {
                publicacao.id === idPublicacao;
            });

        try {
            if (publicacao === undefined) {
                throw new PublicacaoNaoEncontradaError();
            }

            console.log("--> Publicação: \n" + publicacao.conteudo + "\n");
            let novaPublicacao = this._input("--> Digite a nova publicação: ");

            enter();
            cls();
            publicacao.conteudo = novaPublicacao;
            console.log("Publicação alterada com sucesso...");
            enter();
            cls();

        } catch (erro) {
            console.error(erro);
        }
    }

    private adicionarAmigo(usuario: Perfil): void {
        let apelidoReceptor = this._input("--> Digite o ID do amigo que deseja adicionar: ");
        this._redeSocial.enviarSolicitacao(usuario.apelido, apelidoReceptor);
        console.log("Solicitação enviada com sucesso...");
        enter();
        cls();
    }

    private removerPublicacao(usuario: Perfil): void {
        let idPublicacao = this._input("--> Digite o ID da publicação que deseja remover");
        let publicacao: Publicacao = this._redeSocial.buscarPublicacaoPorId(idPublicacao);

        let publicacaoProcurada = this._redeSocial.publicacoes.findIndex(
            (publicacaoProcurada) => publicacaoProcurada.id == publicacao.id
        );
        this._redeSocial.publicacoes.splice(publicacaoProcurada, 1);

        console.log("Publicação removida com sucesso...");
        enter();
        cls();
    }

    private desativarPerfil(usuario: Perfil): void {
        if (usuario.status) {
            usuario.ativar();
            console.log("Perfil desativado...");
            enter();
            cls();
        } else {
            console.log("Perfil já está desativado, não pode desativá-lo");
            enter();
            cls();
        }
    }

    private ativarPerfil(usuario: Perfil): void {
        if (!usuario.status) {
            usuario.ativar();
            console.log("Perfil ativado...");
            enter();
            cls();
        } else {
            console.log("Perfil já está ativado, não pode ativá-lo");
            enter();
            cls();
        }
    }

    private statusPerfil(usuario: Perfil): void {
        let menu = "-> 1 - Ativar Perifl; \n-> 2 - Desativar Perfil;";
        console.log(menu);
        let opcao = Number(this._input("--> Digite a opção que deseja: "));
        cls();
        switch (opcao) {
            case 1:
                this.ativarPerfil(usuario);
                break;
            case 2:
                this.desativarPerfil(usuario);
                break;
            default:
                console.log("Opção inválida...");
        }
    }

    // TODO: Refatorar para que as publicações sejam exibidas de uma forma mais eficaz
    // É ruim que o usuario tenha que digitar a cada feed que queira ver.
    private exibirFeed(): void {
        let publicacoesAux = this._redeSocial.publicacoes.sort(
            (a, b) => b.data.getTime() - a.data.getTime()
        );

        if (publicacoesAux.length <= 0) {
            console.log("Não existem publicações...");
            enter();
            cls();
            return;
        }

        let flag = true;
        let indice = 0;

        while (flag && indice < publicacoesAux.length) {
            for (let i = 0; i < 1 && indice < publicacoesAux.length; i++) {
                publicacoesAux[indice].exibir();
                console.log("\n");
                indice++;
            }

            let opcao = this._input("--> Deseja continuar(S/N): ");
            enter();
            cls();
            if (opcao.toLocaleLowerCase() === "s") {
                flag = true;
            } else {
                flag = false;
            }
        }

        if (indice >= publicacoesAux.length) {
            console.log("Não existem mais publicações...");
            enter();
            cls();
        }
    }

    // TODO: Finalizar metodo
    private interacaoPublicacao(publicacao: Publicacao): void {
        console.log(
            "--> 1 - Curtir publicação; \n" + "--> 2 Não quero curtir;\n"
        );
        let opcao = Number(this._input("Escolha opção: "));
        if (opcao === 1) {
        }
    }

    private vizualizarPerfilAvancado() {
        const nomePerfil = this._input("Digite o NOME do seu perfil --> ");
        let opcao = -1;
        const usuario = this._redeSocial.buscarPerfilPorApelido(nomePerfil);

        if (!(usuario instanceof PerfilAvancado)) {
            console.log("Seu perfil não pode acessar essas configurações...");
            enter();
            cls();
            return;
        }

        const menu =
            `--> ${usuario.apelido} <---\n\n` +
            `--> Opções: \n` +
            `--> 1 - Criar Publicação;\n` +
            "--> 2 - Minhas Publicações;\n" +
            "--> 3 - Editar Publicação;\n" +
            "--> 4 - Remover Publicação;\n" +
            `--> 5 - Adicionar Amigo;\n` +
            "--> 6 - Amigos;\n" +
            "--> 7 - Solicitações;\n" +
            "--> 8 - Ativar/Desativar Perfil;\n" +
            "--> 0 - Voltar";
        do {
            console.log(menu);
            opcao = Number(this._input("--> Qual opção deseja: "));
            cls();
            switch (opcao) {
                case 1:
                    this.criarPublicacao(usuario);
                    break;
                case 2:
                    this.exibirMinhasPublicacoes(usuario);
                    break;
                case 3:
                    this.editarPublicacao(usuario);
                    break;
                case 4:
                    this.removerPublicacao(usuario);
                    break;
                case 5:
                    this.adicionarAmigo(usuario);
                    break;
                case 6:
                    this.exibirAmigos(usuario);
                    break;
                case 7:
                    cls();
                    this.exibirSolicitacoes(usuario);
                    break;
                case 8:
                    this.statusPerfilAvancado(usuario);
                    break;
            }
        } while (opcao !== 0);
    }

    private statusPerfilAvancado(usuario: Perfil) {
        let menu = "--> 1 - Seu Perfil; \n" + "--> 2 - Outro Perfil";
        let opcao = Number(this._input("--> Digite sua opção: "));
        enter();
        cls();
        if (opcao === 1) {
            this.statusPerfil(usuario);
        } else if (opcao === 2) {
            let nomeUsuario =
                this._input("--> Digite o NOME do perfil que deseja alterar o status: ");
            enter();
            cls();
            let usuarioProcurado =
                this._redeSocial.buscarPerfilPorApelido(nomeUsuario);
            this.statusPerfil(usuarioProcurado);
        }
    }

}

let app: App = new App();
app.menu();
