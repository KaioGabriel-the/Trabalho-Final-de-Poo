import { TipoInteracaoEnum } from "../enums/tipoInteracaoEnum"
import Perfil from "./perfil";
import { ulid } from "ulid";
export default class Interacao {

    // ID único, tipo de interação (emoji), perfil autor da interação.
    private _id: string
    private _tipo: TipoInteracaoEnum
    private _perfil: Perfil

    constructor(perfil: Perfil, tipo: TipoInteracaoEnum) {
        this._id = ulid().toString();
        this._tipo = tipo;
        this._perfil = perfil;
    }

    public get id(): string {
        return this._id;
    }

    public get tipo(): TipoInteracaoEnum {
        return this._tipo;
    }

    public get perfil(): Perfil {
        return this._perfil;
    }

    public set perfil(perfil: Perfil) {
        this._perfil = perfil;
    }

    public set tipo(tipo: TipoInteracaoEnum) {
        this._tipo = tipo;
    }
}