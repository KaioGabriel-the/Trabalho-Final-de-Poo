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
        "1- Criar Perfil;\n"+
        "2- Fazer Postagem;\n"+
        "3- Adicionar Amigo;\n"+
        "4- Solicitações;\n" +
        "5- Criar Avançado;\n" + 
        "6- Ativar/Desativar;\n" +
        "7- Editar publicação;\n" +
        "8- Remover publicação;\n"+
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
                    this.exibirSolicitacoes();
                    break;
                case 5:
                    this.criarPerfilAvancado();
                    break;
                case 6:
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
        "--> 1 - Aceitar solicitação \n" + 
        "--> 2 - Recusar solicitação \n" + 
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
        }
    }

    private exibirSolicitacoes(): void{
        console.log("Qual o ID do seu perfil: ")
        let idRecptor = String(this._input);
        let receptor = this._redeSocial.buscarPerfilPorId(idRecptor);
        
        if(receptor){
            let solicitacoes = this._redeSocial.solicitacoes;

            if(solicitacoes.has(receptor)){
                let listaSolicitacoes = solicitacoes.get(receptor);
                
                if(listaSolicitacoes && listaSolicitacoes.length > 0){
                    console.log("--> Solicitações: ");
                    listaSolicitacoes.forEach((perfil: Perfil)=> {console.log(perfil.toString());});
                    this.statusDaSolicitacao(receptor);
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
}
