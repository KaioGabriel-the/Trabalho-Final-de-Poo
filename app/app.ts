import prompt from "prompt-sync";
import RedeSocial from "../redeSocial";
import Perfil from "../entities/perfil";
import PerfilAvancado from "../entities/perfilAvancado";
import Publicacao from "../entities/publicacao";
import { PublicacaoNaoEncontradaErro } from "../exceptions/excecoesPerfil";
import { cls, enter } from "../utils/utils";
import PublicacaoAvancada from "../entities/publicacaoAvancada";

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
      "1 - Criar Perfil;\n" +
      "2 - Entrar em Perfil;\n" +
      "3 - Criar Perfil Avançado;\n" +
      "4 - Entrar em Perfil Avançado;\n" +
      "5 - Feed de Publicações;\n";

    do {
      console.log(menuOpcoes);
      opcao = Number(this._input("Digite a opção que deseja: "));
      cls();
      switch (opcao) {
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
          this.vizualizarPerfilAvancado();
          break;
        case 5:
          this.exibirFeed();
          break;
      }
    } while (opcao != 0);
  }

  private menuEmoji(): String {
    let menu: String =
      "----- Menu de emojis -----\n" +
      "0 - 😁 \n1 - 😉 \n2 - 😇 \n3 - 🙃 \n4 - 😷\n";
    console.log(menu);
    let emoji = Number(this._input("Escolha sua foto de perfil: "));
    let arrayEmoji = ["😁", "😉", "😇", "🙃", "😷"];
    return arrayEmoji[emoji];
  }

  private criarPerfil(): void {
    console.log("----- Criando Perfil ----- \n");
    let nomeUsuario = String(this._input("--> Digite o seu nome de usuario: "));
    enter();
    cls();
    let fotoPerfil = String(this.menuEmoji());
    enter();
    cls();
    let emailUsuario = String(this._input("--> Digite o seu email: "));
    enter();
    cls();
    let novoPerfil: Perfil = new Perfil(nomeUsuario, fotoPerfil, emailUsuario);
    this._redeSocial.adicionarPerfil(novoPerfil);
    console.log("Perfil criado com sucesso 🚀🚀🚀");
    console.log(novoPerfil.toString());
    enter();
    cls();
  }

  private vizualizarPerfil(): void {
    const nomePerfil = String(this._input("Digite o NOME do seu perfil --> "));
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
      opcao = Number(this._input("--> Qual opção deseja: "));
      cls();
      switch (opcao) {
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
          cls();
          this.exibirSolicitacoes(usuario);
          break;
        case 8:
          this.statusPerfil(usuario);
          break;
      }
    } while (opcao != 0);
  }

  private criarPublicacao(usuario: Perfil): void {
    let textPublicacao = String(this._input("--> Escrevar sua publicação: "));
    enter();
    cls();
    this._redeSocial.adicionarPublicacao(textPublicacao, usuario);
    console.log("Publicação feita com sucesso");
    enter();
    cls();
  }

  private enviarSolicitacao(emissor: Perfil): void {
    let nomerecptor = String(
      this._input("Digite o nome do perfil que está procurando: ")
    );
    let receptor = this._redeSocial.buscarPerfilPorApelido(nomerecptor);
    this._redeSocial.enviarSolicitacao(emissor, receptor);
    console.log("Solicitação enviada com sucesso!!!");
  }

  private recusarSolicitacao(receptor: Perfil): void {
    let nomeEmissor = String(
      this._input("Digite o nome do perfil que deseja aceitar a solicitação: ")
    );
    let perfilEmissor = this._redeSocial.buscarPerfilPorApelido(nomeEmissor);
    this._redeSocial.rejeitarSolicitacao(perfilEmissor, receptor);
    console.log("Solicitação recusada com sucesso...");
  }

  private aceitarSolocitacao(receptor: Perfil): void {
    let nomeEmissor = String(
      this._input("Digite o nome do perfil que deseja aceitar a solicitação: ")
    );
    let perfilEmissor = this._redeSocial.buscarPerfilPorApelido(nomeEmissor);
    this._redeSocial.aceitarSolicitacao(perfilEmissor, receptor);
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
    }
  }

  private exibirSolicitacoes(usuario: Perfil): void {
    if (usuario) {
      let solicitacoes = this._redeSocial.solicitacoes;

      if (solicitacoes.has(usuario)) {
        let listaSolicitacoes = solicitacoes.get(usuario);

        if (listaSolicitacoes && listaSolicitacoes.length > 0) {
          console.log("--> Solicitações: ");
          listaSolicitacoes.forEach((perfil: Perfil) => {
            console.log(perfil.toString());
          });
          this.statusDaSolicitacao(usuario);
        } else {
          console.log("Não há solicitações pendentes...");
        }
      } else {
        console.log("Não solicitações para esse perfil...");
      }
    } else {
      console.log("Perfil não encontrado...");
    }
  }

  private criarPerfilAvancado(): void {
    console.log("----- Criando Perfil ----- \n");
    let nomeUsuario = String(this._input("--> Digite o seu nome de usuario: "));
    enter();
    cls();
    let fotoPerfil = String(this.menuEmoji());
    enter();
    cls();
    let emailUsuario = String(this._input("--> Digite o seu email: "));
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

  private exibirMinhasPublicacao(usuario: Perfil): void {
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
    let idPublicacao = String(
      this._input("--> Digite o ID da publicação que deseja editar: ")
    );
    enter();
    cls();
    let publicacao: Publicacao | undefined = this._redeSocial.publicacoes.find(
      (publicacao) => {
        publicacao.id === idPublicacao;
      }
    );

    try {
      if (publicacao === undefined) {
        throw new PublicacaoNaoEncontradaErro();
      }

      console.log("--> Publicação: \n" + publicacao.conteudo + "\n");
      let novaPublicacao = String(
        this._input("--> Digite a nova publicação: ")
      );
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
    let idReceptor = String(
      this._input("--> Digite o ID do amigo que deseja adicionar: ")
    );
    enter();
    cls();
    let receptor = this._redeSocial.buscarPerfilPorId(idReceptor);
    this._redeSocial.enviarSolicitacao(usuario, receptor);
    console.log("Solicitação enviada com sucesso...");
    enter();
    cls();
  }

  private removerPublicacao(usuario: Perfil): void {
    let idPublicacao = String(
      this._input("--> Digite o ID da publicação que deseja remover")
    );
    enter();
    cls();
    let publicacao: Publicacao | undefined = this._redeSocial.publicacoes.find(
      (publicacao) => {
        publicacao.id === idPublicacao;
      }
    );

    try {
      if (publicacao === undefined) {
        throw new PublicacaoNaoEncontradaErro();
      }
      let publicacaoProcurada = this._redeSocial.publicacoes.findIndex(
        (publicacaoProcurada) => publicacaoProcurada.id == publicacao.id
      );
      this._redeSocial.publicacoes.splice(publicacaoProcurada, 1);
      console.log("Publicação removida com sucesso...");
      enter();
      cls();
    } catch (erro) {
      console.error(erro);
    }
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

  private interacaoPublicacao(publicacao: Publicacao): void {
    console.log("--> 1 - Curtir publicação; \n" + "--> 2 Não quero curtir;\n");
    let opcao = Number(this._input("Escolha opção: "));
    if (opcao === 1) {
    }
  }

  private vizualizarPerfilAvancado() {
    const nomePerfil = String(this._input("Digite o NOME do seu perfil --> "));
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
      let nomeUsuario = String(
        this._input("--> Digite o NOME do perfil que deseja alterar o status: ")
      );
      enter();
      cls();
      let usuarioProcurado =
        this._redeSocial.buscarPerfilPorApelido(nomeUsuario);
      this.statusPerfil(usuarioProcurado);
    }
  }

  private interagirPublicacao():void{
    
  }
}

let app: App = new App();
app.menu();
