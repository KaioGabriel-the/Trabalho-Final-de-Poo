import * as fs from "fs";
import * as path from "path";
import Perfil from "../entities/perfil";
import PerfilAvancado from "../entities/perfilAvancado";
import Publicacao from "../entities/publicacao";
import PublicacaoAvancada from "../entities/publicacaoAvancada";
import Interacao from "../entities/interacao";

export class CarregadorDeDados {

    // Carrega todos os dados do json
    public static carregarDados(): object {
        const data = fs.readFileSync(path.join(__dirname, "../../data/data.json"), "utf-8");
        const json: object = JSON.parse(data);

        const perfis: Perfil[] = this.carregarPerfis(json); 
        const publicacoes: Publicacao[] = this.carregarPublicacoes(json, perfis);
        this.carregarAmizades(json, perfis);
        const solicitacoes: Map<Perfil, Perfil[]> = this.carregarSolicitacoes(json, perfis);

        return { perfis, publicacoes, solicitacoes };
    }

    // Mapeia os perfis a partir de um json
    public static carregarPerfis(json: any): Perfil[] {
        return json.users.map((user: any) => {
            let perfil: Perfil;

            const statusPerfil: boolean = user.status;

            if (user.type === "NORMAL") {
                perfil = new Perfil(user.username, user.photo, user.email, user.id, statusPerfil);
            } else {
                perfil = new PerfilAvancado(user.username, user.photo, user.email, user.id, statusPerfil);
            }

            return perfil;
        });
    }


    // Mapeia as publicacoes (se for avançada, também traz as interações) a partir de um json
    public static carregarPublicacoes(json: any, perfis: Perfil[]): Publicacao[] {
        return json.publications.map((pub: any) => {
            let publicacao: Publicacao;
            
            let user: Perfil = perfis.find((perfil: Perfil) => perfil.id === pub.userId)!;

            if (pub.type === "NORMAL") {
                publicacao = new Publicacao(pub.content, user, pub.id, new Date(pub.timestamp));
            } else {
                publicacao = new PublicacaoAvancada(pub.content, user, pub.id, new Date(pub.timestamp));

                pub.interactions.forEach((interacaoJson: any) => {
                    const perfilInteracao: Perfil = perfis.find((perfil: Perfil) => perfil.id === interacaoJson.userId)!;

                    const novaInteracao = new Interacao(perfilInteracao, interacaoJson.type, interacaoJson.id);
                    (publicacao as PublicacaoAvancada).addInteracao(novaInteracao);
                })
            }

            return publicacao;
        });    
    }

    /*Função para mapear as amizades. As amizades são ponteiros em memória,
    e o JSON deve conter apenas strings. Pensando nisso, esse método percorre o json
    e "remapeia" esses ponteiros em memória. não é a maneira mais eficiente, obviamente,
    mas é o que considerei mais adequado para esse tratamento de dados. -- Xama */
    public static carregarAmizades(json: any, perfis: Perfil[]): void {
        json.friendships.forEach((amizade: any) => {
            const perfil: Perfil = perfis.find((perfil) => perfil.id === amizade.userId)!;
            
            amizade.friendIds.forEach((amigoId: string) => {
                const amigo: Perfil = perfis.find((perfil: Perfil) => perfil.id === amigoId)!;
                perfil.adicionarAmigo(amigo);
            })
        })
    }

    // Carrega as solicitacoes em um hashmap
    public static carregarSolicitacoes(json: any, perfis: Perfil[]): Map<Perfil, Perfil[]> {
        const solicitacoes: Map<Perfil, Perfil[]> = new Map<Perfil, Perfil[]>();

        json.friendRequests.forEach((solicitacao: any) => {
            const receptor: Perfil = perfis.find((perfil) => perfil.id === solicitacao.receiverId)!;
            solicitacoes.set(receptor, []);

            solicitacao.senderIds.forEach((emissorId: string) => {
                const emissor: Perfil = perfis.find((perfil: Perfil) => perfil.id === emissorId)!;
                solicitacoes.get(receptor)!.push(emissor);
            });
        });

        return solicitacoes;
    }
}