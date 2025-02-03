import prompt from 'prompt-sync';
import RedeSocial from '../redeSocial';
import Perfil from '../entities/perfil';

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
        "1- Criar Perfil;\n"+
        "2- Fazer Postagem;\n"+
        "3- Adicionar amigo;\n"+
        "4- Solicitações\n" +
        "Digite a opção que deseja: ";

        do{
            console.log(menuOpcoes);
            opcao = Number(this._input);

            switch(opcao){
                case 1:
                    this.criarPerfil();
                    break;
                case 2:
                    this.criarPublicacao();
                    break;
                case 3:
                    this.enviarSolicitacao();
                    break;    
                case 4:
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

    private criarPublicacao(): void{
        console.log("Digite o ID do seu perfil: ");
        let idUsuario = String(this._input);
        console.log("--> Publicação: ");
        let perfil = this._redeSocial.buscarPerfilPorId(idUsuario)
        let textPublicacao = String(this._input);
        this._redeSocial.adicionarPublicacao(textPublicacao,perfil);
        console.log("Publicação feita com sucesso");
    }

    private enviarSolicitacao(): void{
        console.log("Digite o ID do seu perfil: ");
        let idEmissor = String(prompt());
        let emissor = this._redeSocial.buscarPerfilPorId(idEmissor);
        console.log("Digite o nome do perfil: ");
        let nomerecptor = String(this._input);
        let receptor = this._redeSocial.buscarPerfilPorApelido(nomerecptor);
        this._redeSocial.enviarSolicitacao(emissor,receptor);
        console.log("Solicitação enviada com sucesso!!!");
    }

    private exibirSolicitacoes(): void{
        console.log("Qual o ID do seu perfil: ")
        let idRecptor = String(this._input);
        let receptor = this._redeSocial.buscarPerfilPorId(idRecptor);
    }
}
