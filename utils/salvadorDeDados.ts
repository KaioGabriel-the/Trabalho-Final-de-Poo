import fs from "fs"
import Perfil from "../entities/perfil";
import PerfilAvancado from "../entities/perfilAvancado";
import Publicacao from "../entities/publicacao";
import PublicacaoAvancada from "../entities/publicacaoAvancada";
import RedeSocial from "../redeSocial";


export default class SalvadorDeDados {

    // Grava todos os dados em um arquivo JSON
    public static salvarDados(redeSocial: RedeSocial): void {
        const dados = {
            "users": this.prepararPerfis(redeSocial.perfis),
            "publications":  this.prepararPublicacoes(redeSocial.publicacoes),
            "friendRequests": this.prepararSolicitacoes(redeSocial.solicitacoes),
            "friendships": this.prepararAmizades(redeSocial.perfis)
        }

        const jsonData = JSON.stringify(dados, null, 4);
        fs.writeFileSync("./data/data.json",jsonData,"utf-8")
    }

    // Prepara o array de perfis para ser gravado num JSON
    public static prepararPerfis(perfis: Perfil[]): object[] {
        const perfisJson: object[] = perfis.map(perfil => {
            return {
                type: perfil instanceof PerfilAvancado ? "ADVANCED" : "NORMAL",
                id: perfil.id,
                username: perfil.apelido,
                email: perfil.email,
                status: perfil.status
            }
        })

        return perfisJson;
    }

    // Prepara as publicações para serem gravadas no JSON
    public static prepararPublicacoes(publicacoes: Publicacao[]): object[] {
        const publicacoesJson: object[] = publicacoes.map(publicacao => {
            const pub: any = {
                "type": publicacao instanceof PublicacaoAvancada ? "ADVANCED" : "NORMAL",
                "id": publicacao.id,
                "content": publicacao.conteudo,
                "timestamp": publicacao.data,
                "userId": publicacao.perfil.id,
            }

            // Logica para adicionar as interações no JSON, em caso de publicação avançada
            if (publicacao instanceof PublicacaoAvancada) {
                pub.interactions = publicacao.interacoes.map(interacao => {
                    return {
                        "id": interacao.id,
                        "userId": interacao.perfil.id,
                        "type": interacao.tipo
                    }
                });
            }
            
            return pub;
        })

        return publicacoesJson;
    }
    // Prepara o hashmap de solicitações de amizade para ser gravado num JSON
    public static prepararSolicitacoes(solicitacoes: Map<Perfil, Perfil[]>): object[] {
        const solicitacoesJson: object[] = [];

        solicitacoes.forEach((emissores, receptor) => {
            const relacao: any = {};
            relacao.receiverId = receptor.id;
            relacao.senderIds = emissores.map(emissor => emissor.id);

            solicitacoesJson.push(relacao);
        });

        return solicitacoesJson;
    }

    public static prepararAmizades(perfis: Perfil[]): object[] {
        const amizadesJson: object[] = [];

        perfis.forEach(perfil => {
            if (perfil.amigos.length > 0){
                const relacaoAmizade: object = {
                    "userId": perfil.id,
                    "friendIds": perfil.amigos.map(amigo => amigo.id),    
                };

                amizadesJson.push(relacaoAmizade);
            }
        });

        return amizadesJson;
    }
}