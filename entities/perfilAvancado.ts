import Perfil from "./perfil";

export default class PerfilAvancado extends Perfil {
    private habilitarPerfil(perfil: Perfil): void {
        perfil.ativar();    
    }

    private desabilitarPerfil(perfil: Perfil): void {
        perfil.desativar();    
    }
}