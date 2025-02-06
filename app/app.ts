import prompt from 'prompt-sync';
import RedeSocial from '../redeSocial';
import Perfil from '../entities/perfil';
import PerfilAvancado from '../entities/perfilAvancado';
import Publicacao from '../entities/publicacao';
import { PublicacaoNaoEncontradaErro } from '../exceptions/excecoesPerfil';

class App{
    private _input: prompt.Prompt;
    private _redeSocial: RedeSocial;

    constructor(){
        this._input = prompt();
        this._redeSocial = new RedeSocial();
    }

    public menu(): void{
        let opcao: number = -1;

        const menuOpcoes: String = " ----- REDE SOCIAL -----" + "\n"+
        "1 - Criar Perfil;\n"+
        "2 - Entrar em Perfil;\n"+
        "3 - Criar Perfil Avançado;\n" +
        "4 - Entrar em Perfil Avançado;\n"+
        "5 - Feed de Publicações;\n" +
        "Digite a opção que deseja: ";

        do{
            console.log(menuOpcoes);
            opcao = Number(this._input);

            switch(opcao){
                case 1:
                    this.criarPerfil();
                    break;
                case 2:
                    this.vizualizarPerfil();
                   break;
                case 3:
                    this.criarPerfilAvancado();
                    break;
                case 4:
                    break;
                case 5:
                    break;        
            }

        }while(opcao != 0);
    }

    private menuEmoji(): String{
        let menu: String = "----- Menu de emojis -----\n"+"0 - 😁 \n1 - 😉 \n2 - 😇 \n3 - 🙃 \n4 - 😷\n"+ "Escolha sua foto de perfil: \n";
        console.log(menu);
        let emoji: number = Number(this._input);
        let arrayEmoji = ["😁","😉","😇","🙃","😷"];
        return arrayEmoji[emoji];
    }

    private criarPerfil(): void{
        console.log("----- Criando Perfil ----- \n" + "--> Digite o seu nome de usuario: ");
        let nomeUsuario = String(this._input);
        let fotoPerfil = String(this.menuEmoji());
        console.log("--> Digite o seu email: ");
        let emailUsuario = String(this._input);
        let novoPerfil: Perfil = new Perfil(nomeUsuario,fotoPerfil,emailUsuario);
        this._redeSocial.adicionarPerfil(novoPerfil);
        console.log("Perfil criado com sucesso 🚀🚀🚀");
        novoPerfil.toString();
    }

    private vizualizarPerfil(): void{
        console.log("Digite o ID do seu perfil --> ");
        const idPerfil = String(this._input);
        const usuario = this._redeSocial.buscarPerfilPorId(idPerfil);
        const menu = `--> ${usuario.apelido} <---\n\n` + 
        `--> Opções: \n` +
        `--> 1 - Criar Publicação;\n`+ 
        "--> 2 - Minhas Publicações;\n" +
        "--> 3 - Editar Publicação;\n" +
        "--> 4 - Remover Publicação;\n" +
        `--> 5 - Adicionar Amigo;\n` +
        "--> 6 - Amigos;\n"+
        "--> 7 - Solicitações;\n"+
        "--> 8 - Ativar/Desativar Perfil;\n"+
        "--> Qual opção deseja: \n";

        let opcao: Number = -1;
        do{
            console.log(menu);
            opcao = Number(this._input);

            switch(opcao){
                case 1:
                    this.criarPublicacao(usuario);
                    break;
                case 2:
                    this.exibirMinhasPublicacao(usuario);
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
        }while(opcao != 0);
    }

    private criarPublicacao(usuario: Perfil): void{
        console.log("--> Publicação: ");
        let textPublicacao = String(this._input);
        this._redeSocial.adicionarPublicacao(textPublicacao,usuario);
        console.log("Publicação feita com sucesso");
    }

    private enviarSolicitacao(emissor: Perfil): void{
        console.log("Digite o nome do perfil que está procurando: ");
        let nomerecptor = String(this._input);
        let receptor = this._redeSocial.buscarPerfilPorApelido(nomerecptor);
        this._redeSocial.enviarSolicitacao(emissor,receptor);
        console.log("Solicitação enviada com sucesso!!!");
    }

    private recusarSolicitacao(receptor: Perfil): void{
        console.log("Digite o nome do perfil que deseja aceitar a solicitação: ");
        let nomeEmissor = String(this._input);
        let perfilEmissor = this._redeSocial.buscarPerfilPorApelido(nomeEmissor);
        this._redeSocial.rejeitarSolicitacao(perfilEmissor,receptor);
        console.log("Solicitação recusada com sucesso...")
    }

    private aceitarSolocitacao(receptor: Perfil): void{
        console.log("Digite o nome do perfil que deseja aceitar a solicitação: ");
        let nomeEmissor = String(this._input);
        let perfilEmissor = this._redeSocial.buscarPerfilPorApelido(nomeEmissor);
        this._redeSocial.aceitarSolicitacao(perfilEmissor,receptor);
        console.log("Solicitação aceita com sucesso...");
    }

    private statusDaSolicitacao(receptor: Perfil): void{
        let menu: String = "----- Status da Solicitação ----- \n" + 
        "--> 1 - Aceitar Solicitação \n" + 
        "--> 2 - Recusar Solicitação \n" +
        "--> 3 - Enviar Solicitação"
        "--> Digite sua escolha: ";
        console.log(menu);
        let opcao = Number(this._input);
        switch(opcao){
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
        }
    }

    private exibirSolicitacoes(usuario: Perfil): void{
        if(usuario){
            let solicitacoes = this._redeSocial.solicitacoes;

            if(solicitacoes.has(usuario)){
                let listaSolicitacoes = solicitacoes.get(usuario);
                
                if(listaSolicitacoes && listaSolicitacoes.length > 0){
                    console.log("--> Solicitações: ");
                    listaSolicitacoes.forEach((perfil: Perfil)=> {console.log(perfil.toString());});
                    this.statusDaSolicitacao(usuario);
                }else{
                    console.log("Não há solicitações pendentes...")
                }
            }else{
                console.log("Não solicitações para esse perfil...")
            }
        }else{
            console.log("Perfil não encontrado...")
        }
    }

    private criarPerfilAvancado(): void{
        console.log("----- Criando Perfil ----- \n" + "--> Digite o seu nome de usuario: ");
        let nomeUsuario = String(this._input);
        let fotoPerfil = String(this.menuEmoji());
        console.log("--> Digite o seu email: ");
        let emailUsuario = String(this._input);
        let perfilAvancado = new PerfilAvancado(nomeUsuario,fotoPerfil,emailUsuario);
        this._redeSocial.adicionarPerfil(perfilAvancado);
        console.log("Perfil avançado criado com sucesso...");
    }

    private exibirMinhasPublicacao(usuario: Perfil): void{
        this._redeSocial.exibirPublicacoesOrdenadas(usuario);
    }

    private exibirAmigos(usuario: Perfil): void{
        const amigos = usuario.amigos;
        amigos.forEach((amigo)=> { console.log(`${amigo.toString()}\n`)});
    }    
    
    private editarPublicacao(usuario: Perfil): void{
        console.log("--> Digite o ID da publicação que deseja editar");
        let idPublicacao = String(this._input);
        let publicacao: Publicacao | undefined = (this._redeSocial.publicacoes).find((publicacao) =>{publicacao.id === idPublicacao});

        try{

            if(publicacao === undefined){
                throw new PublicacaoNaoEncontradaErro();
            }

            console.log("--> Publicação: \n"+ publicacao.conteudo + "\n");
            console.log("--> Digite a nova publicação: \n");
            let novaPublicacao = String(this._input);
            publicacao.conteudo = novaPublicacao;
            console.log("Publicação alterada com sucesso...");
        }catch(erro){
            console.log(erro);
        }
    }

    private adicionarAmigo(usuario: Perfil): void{
        console.log("--> Digite o ID do amigo que deseja adicionar: \n");
        let idReceptor = String(this._input);
        let receptor = this._redeSocial.buscarPerfilPorId(idReceptor);
        this._redeSocial.enviarSolicitacao(usuario,receptor);
        console.log("Solicitação enviada com sucesso...");
    }

    private removerPublicacao(usuario: Perfil): void{
        console.log("--> Digite o ID da publicação que deseja remover");
        let idPublicacao = String(this._input);
        let publicacao: Publicacao | undefined = (this._redeSocial.publicacoes).find((publicacao) =>{publicacao.id === idPublicacao});

        try{

            if(publicacao === undefined){
                throw new PublicacaoNaoEncontradaErro();
            }
            let publicacaoProcurada = this._redeSocial.publicacoes.findIndex((publicacaoProcurada)=> publicacaoProcurada.id == publicacao.id);
            this._redeSocial.publicacoes.splice(publicacaoProcurada,1);
            console.log("Publicação removida com sucesso...");
        }catch(erro){
            console.log(erro);
        }
    }

    private desativarPerfil(usuario: Perfil): void{
        if(usuario.status){
            usuario.ativar();
            console.log("Perfil desativado...");
        }else{
            console.log("Perfil já está desativado, não pode desativá-lo");
        }
    }

    private ativarPerfil(usuario: Perfil): void{
        if(!usuario.status){
            usuario.ativar();
            console.log("Perfil ativado...");
        }else{
            console.log("Perfil já está ativado, não pode ativá-lo");
        }
    }

    private statusPerfil(usuario: Perfil):void{
        let menu = "-> 1 - Ativar Perifl; \n-> 2 - Desativar Perfil;"
        console.log(menu);
        let opcao = Number(this._input);

        switch(opcao){
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

    private exibirFeed(): void{
        this._redeSocial.publicacoes.sort((a, b) => b.data.getTime() - a.data.getTime());
    }
}
