import Perfil from "./perfil";

export default class PerfilAvancado extends Perfil {

    constructor(_apelido: string, _foto: string, _email: string, _id?: string, _status?: boolean) {
        super(_apelido, _foto, _email, _id, _status);
    }
    
    public habilitarPerfil(perfil: Perfil): void {
        perfil.ativar();    
    }

    public desabilitarPerfil(perfil: Perfil): void {
        perfil.desativar();    
    }
}