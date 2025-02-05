import prompt from 'prompt-sync';
import RedeSocial from '../redeSocial';
import Perfil from '../entities/perfil';
import PerfilAvancado from '../entities/perfilAvancado';

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
        "5 - Feed;\n" +
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
                    break;
                case 4:
                    break;
                case 5:
                    break;
                case 6:
                    this.exibirAmigos(usuario);
                    break;
                case 7:
                    this.exibirSolicitacoes(usuario);
                    break;
                case 8:
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
     
}
