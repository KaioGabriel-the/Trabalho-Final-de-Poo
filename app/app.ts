import prompt from "prompt-sync";
import RedeSocial from "../redeSocial";
import Perfil from "../entities/perfil";
import PerfilAvancado from "../entities/perfilAvancado";
import Publicacao from "../entities/publicacao";
import { cls, enter } from "../utils/utils";
import AppError from "../exceptions/appExcecao";
import { PublicacaoNaoEncontradaError } from "../exceptions/excecoesPublicacao";
import { CarregadorDeDados } from "../utils/carregadorDeDados";
import PublicacaoAvancada from "../entities/publicacaoAvancada";
import Interacao from "../entities/interacao";
import { TipoInteracaoEnum } from "../enums/tipoInteracaoEnum";
import SalvadorDeDados from "../utils/salvadorDeDados";

class App {
    private _input: prompt.Prompt;
    private _redeSocial: RedeSocial;

    constructor() {
        this._input = prompt();
        this._redeSocial = new RedeSocial();
        this._redeSocial.carregarPropriedades(CarregadorDeDados.carregarDados());
    }

    public menu(): void {
        let opcao: number = -1;

        const menuOpcoes: String =
            " ----- REDE SOCIAL -----" +
            "\n" +
            "1 - Criar Perfil\n" +
            "2 - Entrar em Perfil\n" +
            "3 - Feed de Publicações\n"+
            "0 - Sair\n";
           
        do {
            try { 
                cls();
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
                        this.exibirFeed();
                        enter();
                        break;
                }
            } catch (error) {
                if (error instanceof AppError) {
                    cls()
                    console.log("Erro! " + error.message);
                    enter();
                    cls();
                }else {
                    cls();
                    console.log("Erro inesperado! Contate o suporte.");
                    enter();
                    cls();
                }
            }
        } while (opcao !== 0 && opcao); // TODO: Ajeitar o loop

        SalvadorDeDados.salvarDados(this._redeSocial);
    }

    private menuEmoji(): string {
        let menu: string =
            "----- Menu de emojis -----\n" +
            "0 - 😁 \n1 - 😉 \n2 - 😇 \n3 - 🙃 \n4 - 😷\n";
        console.log(menu);
        let emoji = Number(this._input("--> Escolha sua foto de perfil: "));
        let arrayEmoji = ["😁", "😉", "😇", "🙃", "😷"];
        return arrayEmoji[emoji];
    }

    private criarPerfil(): void {
        console.log("----- Criando Perfil ----- \n");
        console.log("--> 0 - Perfil comum; \n--> 1 - Perfil Avançado \n");

        let tipoPefil = Number(this._input("Qual o tipo: "))

        cls()
        let nomeUsuario = this._input("--> Digite o seu nome de usuario: ");
        this._redeSocial.verificarNovoCadastro(nomeUsuario);
        let fotoPerfil = this.menuEmoji();
        let emailUsuario = this._input("--> Digite o seu email: ");

        let novoPerfil = tipoPefil === 1 ? new PerfilAvancado (nomeUsuario,fotoPerfil,emailUsuario) : new Perfil (nomeUsuario,fotoPerfil,emailUsuario);
        this._redeSocial.adicionarPerfil(novoPerfil);
        
        cls();
        console.log("Perfil criado com sucesso 🚀🚀🚀");
        console.log(novoPerfil.toString());
        enter(); 
    }

    private visualizarPerfil(): void {
        const nomePerfil = this._input("Digite o NOME do seu perfil --> ");
        const usuario = this._redeSocial.buscarPerfilPorApelido(nomePerfil);

        
        let opcao: Number = -1;
        do {
            
            cls();
            const menu =
            `==== ${usuario.apelido} ${usuario.foto} ====\n` +
            `+ ${usuario.status ? "🟢 Ativo" : "🔴 Inativo"}\n\n` +
            
            "--> Opções: \n" +
            "--> 1 - Criar Publicação\n" +
            "--> 2 - Interagir numa publicação\n" +
            "--> 3 - Minhas Publicações\n" +
            "--> 4 - Editar Publicação\n" +
            "--> 5 - Remover Publicação\n" +
            "--> 6 - Adicionar Amigo\n" +
            "--> 7 - Listar Amigos\n" +
            "--> 8 - Solicitações\n" +
            "--> 9 - Ativar/Desativar Perfil\n" +
            "--> 0 - Voltar\n";

            cls();
            console.log(menu);
            opcao = Number(this._input("--> Qual opção deseja?: "));
            cls();
            switch (opcao) {
                case 1:
                    this.criarPublicacao(usuario);
                    break;
                case 2:
                    this.interagirPublicacao(usuario);
                    break;
                case 3:
                    this.exibirMinhasPublicacoes(usuario);
                    enter();
                    break;
                case 4:
                    this.editarPublicacao(usuario);
                    break;
                case 5:
                    this.removerPublicacao(usuario);
                    break;
                case 6:
                    this.adicionarAmigo(usuario);
                    break;
                case 7:
                    this.exibirAmigos(usuario);
                    break;
                case 8:
                    this.exibirSolicitacoes(usuario);
                    break;
                case 9:
                    if((usuario instanceof PerfilAvancado)){
                        this.statusPerfilAvancado(usuario);
                        break;
                    }

                    this.statusPerfil(usuario);
                    break;
            }
        } while (opcao != 0);
    }

    private criarPublicacao(usuario: Perfil): void {
        console.log("--> 0 - Publicação Comum; \n--> 1 - Publicação Avançada; \n");
        let tipoPublicacao = Number(this._input("--> Digite qual tipo de publicação deseja fazer:"));
        let textPublicacao = this._input("--> Escreva aqui o conteúdo da sua publicação: ");
        let publicacao = tipoPublicacao === 1 ? new PublicacaoAvancada(textPublicacao,usuario) : new Publicacao (textPublicacao,usuario);
        this._redeSocial.adicionarPublicacao(publicacao);

        cls();
        console.log("Publicação feita com sucesso!!");
        enter();
        cls();
    }

    private enviarSolicitacao(emissor: Perfil): void {
        let nomeReceptor : string = this._input("Digite o nome do perfil para solicitar amizade: ");
        this._redeSocial.enviarSolicitacao(emissor.apelido, nomeReceptor);

        console.log("Solicitação enviada com sucesso!!!");
        enter();
    }

    private recusarSolicitacao(receptor: Perfil): void {
        let nomeEmissor = this._input("Digite o nome do perfil que deseja aceitar a solicitação: ");

        if (this._input(`Você tem certeza que deseja recusar a solicitação de ${nomeEmissor}? (s/n) `).toLocaleLowerCase() == 's'){
            this._redeSocial.rejeitarSolicitacao(nomeEmissor, receptor.apelido);

            console.log("Solicitação recusada com sucesso...");
            enter()
        }
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

    private exibirSolicitacoes(usuario: Perfil): void {

        let solicitacoes = this._redeSocial.solicitacoes;

        if (this._redeSocial.existeSolicitacaoReceptor(usuario)) {
            let listaSolicitacoes = solicitacoes.get(usuario);

            if (listaSolicitacoes && listaSolicitacoes.length > 0) {
                console.log("--> Solicitações: ");
                listaSolicitacoes.forEach(perfil => console.log(`- ${perfil.apelido}`))
                
            } else {
                console.log("Não há solicitações pendentes...");
            }
        } else {
            console.log("Não há solicitações para esse perfil...\n");
        }

        console.log();
        this.statusDaSolicitacao(usuario);

    }

    private exibirMinhasPublicacoes(usuario: Perfil): void {
        
        if (this._redeSocial.publicacoes.filter(publicacao => publicacao.perfil == usuario).length == 0) {
            console.log("Nenhuma publicação sua encontrada...");
            enter();
            cls();
            return;
        }
        
        this._redeSocial.exibirPublicacoesOrdenadas(usuario);
    }

    private exibirAmigos(usuario: Perfil): void {
        const amigos = usuario.amigos;

        if (amigos.length == 0) {
            console.log("Este perfil ainda não possui amigos, mas não fique triste, que tal adicionar alguns? 😁");
            enter();
            return;
        }

        amigos.forEach((amigo) => {
            console.log(`${amigo.toString()}\n`);
        });
        enter();
    }

    private editarPublicacao(usuario: Perfil): void {

        if (this._redeSocial.publicacoes.filter(publicacao => publicacao.perfil == usuario).length == 0) {
            console.log("Nenhuma publicação sua encontrada...");
            this.visualizarPerfil();
        }

        this.exibirMinhasPublicacoes(usuario);
        let idPublicacao = this._input("--> Digite o ID da publicação que deseja editar: ");
        cls();

        let publicacao: Publicacao = this._redeSocial.buscarPublicacaoDeUmUsuarioPorId(idPublicacao, usuario);

        try {
            if (publicacao === undefined) {
                throw new PublicacaoNaoEncontradaError();
            }

            console.log("--> Publicação: \n" + publicacao.conteudo + "\n");
            let novaPublicacao = this._input("--> Digite a nova publicação: ");

            publicacao.conteudo = novaPublicacao;
            console.log("Publicação alterada com sucesso...");
            enter();
            cls();

        } catch (erro) {
            if (erro instanceof AppError) {
                console.log(erro.message);
            }
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

        this.exibirMinhasPublicacoes(usuario);

        let idPublicacao = this._input("--> Digite o ID da publicação que deseja remover: ");
        let publicacao: Publicacao = this._redeSocial.buscarPublicacaoDeUmUsuarioPorId(idPublicacao, usuario);

        let publicacaoProcurada = this._redeSocial.publicacoes.findIndex(
            (publicacaoProcurada) => publicacaoProcurada.id == publicacao.id
        );
        this._redeSocial.publicacoes.splice(publicacaoProcurada, 1);

        cls();
        console.log("Publicação removida com sucesso...");
        enter();
        cls();
    }

    private desativarPerfil(usuario: Perfil): void {
        if (usuario.status) {
            usuario.desativar();
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

    // Exibe todas as publicações ordenadas da mais recente à mais antiga
    private exibirFeed(): void {
        // Ordena as publicações pela data (mais recentes primeiro)
        let publicacoesAux = this._redeSocial.publicacoes.sort(
            (a, b) => b.data.getTime() - a.data.getTime()
        );
    
        if (publicacoesAux.length === 0) {
            console.log("Não existem publicações...");
            enter();
            return;
        }
    
        console.log("----- FEED DE PUBLICAÇÕES -----");
        publicacoesAux.forEach((publicacao) => {
            publicacao.exibir();
            console.log();
        });
    }
    
    private emoji(opcao: number): TipoInteracaoEnum {
        switch (opcao) {
            case 1:
                return TipoInteracaoEnum.CURTIDA;
            case 2:
                return TipoInteracaoEnum.NAO_CURTIDA;
            case 3:
                return TipoInteracaoEnum.SURPRESA;
            case 4:
                return TipoInteracaoEnum.RISADA;
            default:
                throw new Error("Opção inválida! Escolha um número entre 1 e 4.");
        }
    }

    private interagirPublicacao(ator: Perfil): void {

        this.exibirFeed();

        // Solicita que o usuário escolha uma publicação para interagir
        let opcaoInteracao: string = this._input("Digite o ID da publicação que deseja interagir (ou 0 para sair): ");
        
        
        if (opcaoInteracao == "0" || !opcaoInteracao) {
            return;
        }
        
        const publicacao: Publicacao = this._redeSocial.buscarPublicacaoPorId(opcaoInteracao);

        this._redeSocial.tratarInteracao(ator, publicacao);
        
        let menuInteracao = "Escolha um emoji para reagir com a publicação:\n--> 1 - 👍 \n--> 2 - 👎 \n--> 3 - 😯 \n--> 4 - 😂 \n";
        console.log(menuInteracao);

        let opcao = Number(this._input("Escolha sua opção: "));
        let tipoInteracao = this.emoji(opcao);
        let interacao = new Interacao(ator, tipoInteracao);
        
        this._redeSocial.adicionarInteracao(publicacao as PublicacaoAvancada, ator, interacao);

        console.log("Interação feita com sucesso...");
        enter();
    }

    private statusPerfilAvancado(usuario: Perfil) {
        
        let menu = "--> 1 - Seu Perfil; \n" + "--> 2 - Outro Perfil";
        console.log(menu);

        let opcao = Number(this._input("--> Digite sua opção: "));
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
