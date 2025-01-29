import Perfil from "./perfil";

export default class PerfilAvancado extends Perfil {
    public habilitarPerfil(perfil: Perfil): void {
        perfil.ativar();    
    }

    public desabilitarPerfil(perfil: Perfil): void {
        perfil.desativar();    
    }
}