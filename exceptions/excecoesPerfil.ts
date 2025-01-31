// Adicione pelo menos as exceções personalizadas abaixo para tratar casos específicos como: 
// • Gerenciamento de Perfis: 
//     o IDs ou emails duplicados devem lançar a exceção PerfilJaCadastradoError; 
//     o Perfis  normais  tentando  ativar/desativar  status  de  outro  perfil  devem  lançar  a  exceção 
//     PerfilNaoAutorizadoError. 

export class PerfilJaCadastradoError extends Error {
    constructor() {
        super('O perfil que você está tentando cadastrar já existe!');
    }
}

export class PerfilNaoAutorizadoError extends Error {
    constructor(){
        super('Esse perfil não pode ativar ou desativar o status de outro perfil!')
    }
}