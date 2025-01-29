"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Interacao {
    constructor(perfil, tipo) {
        this._id = Math.random().toString(36).substring(2, 9);
        this._tipo = tipo;
        this._perfil = perfil;
    }
    get id() {
        return this._id;
    }
    get tipo() {
        return this._tipo;
    }
    get perfil() {
        return this._perfil;
    }
    set perfil(perfil) {
        this._perfil = perfil;
    }
    set tipo(tipo) {
        this._tipo = tipo;
    }
}
exports.default = Interacao;
