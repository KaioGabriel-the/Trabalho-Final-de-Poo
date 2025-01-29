"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const perfil_1 = __importDefault(require("./perfil"));
const ulid_1 = require("ulid");
class Publicacao {
    constructor(conteudo, perfil) {
        this._id = (0, ulid_1.ulid)().toString();
        this._conteudo = conteudo;
        this._data = new Date();
        this._perfil = perfil;
    }
    get id() {
        return this._id;
    }
    get conteudo() {
        return this._conteudo;
    }
    get data() {
        return this._data;
    }
    get perfil() {
        return this._perfil;
    }
    set conteudo(conteudo) {
        this._conteudo = conteudo;
    }
}
exports.default = Publicacao;
let pubs = [];
for (let i = 0; i < 10; i++) {
    let p = new Publicacao("Conteudo", new perfil_1.default("Apelido", "Foto", "Email"));
    pubs.push(p);
}
pubs.forEach((item) => {
    console.log(item.id);
});
