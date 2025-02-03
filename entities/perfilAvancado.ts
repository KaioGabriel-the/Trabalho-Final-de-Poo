import Perfil from "./perfil";

export default class PerfilAvancado extends Perfil {

    constructor(_apelido: string, _foto: string, _email: string){
        super(_apelido, _foto, _email);
    }
    
    public habilitarPerfil(perfil: Perfil): void {
        perfil.ativar();    
    }

    public desabilitarPerfil(perfil: Perfil): void {
        perfil.desativar();    
    }
}