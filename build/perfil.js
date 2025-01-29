"use strict";
/**1) Implementação das Classes Básicas (2,0 pontos)
 
• Classe Perfil:
o Atributos:
▪ ID único, apelido, foto (emojis), email, status (ativo/inativo), array de amigos, e
array de postagens.
o Métodos:
▪ Adicionar amigo;
▪ Remover amigo;
▪ Adicionar publicação;
▪ Listar amigos;
▪ Listar postagens;
▪ Ativar/desativar perf */
Object.defineProperty(exports, "__esModule", { value: true });
class Perfil {
    constructor(_apelido, _foto, _email) {
        this._id = Math.random().toString(36).substring(2, 9);
        this._apelido = _apelido;
        this._foto = _foto;
        this._email = _email;
        this._status = true;
    }
    get id() {
        return this._id;
    }
    get apelido() {
        return this._apelido;
    }
    get foto() {
        return this._foto;
    }
    get email() {
        return this._email;
    }
    get amigos() {
        return this._amigos;
    }
    ativar() {
        this._status = true;
    }
    desativar() {
        this._status = false;
    }
}
exports.default = Perfil;
