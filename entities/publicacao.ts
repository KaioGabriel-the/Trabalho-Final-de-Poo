import Perfil from "./perfil";
import { ulid } from "ulid";
export default class Publicacao {
    private _id: string;
    private _conteudo: string;
    private _data: Date;
    private _perfil: Perfil;

    constructor(conteudo: string, perfil: Perfil) {
        this._id = ulid().toString();
        this._conteudo = conteudo;
        this._data = new Date();
        this._perfil = perfil;
    }

    public get id(): string {
        return this._id;
    }

    public get conteudo(): string {
        return this._conteudo;
    }

    public get data(): Date {
        return this._data;
    }

    public get perfil(): Perfil {
        return this._perfil;
    }

    public set conteudo(conteudo: string) {
        this._conteudo = conteudo;
    }

    public set data(data: Date) {
        this._data = data;
    }

}
