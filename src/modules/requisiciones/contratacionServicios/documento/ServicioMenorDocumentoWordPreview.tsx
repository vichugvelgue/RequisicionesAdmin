import React from 'react';
import { DocumentoTabChrome } from './DocumentoTabChrome';


import { servicioGenerarWordDesdePlantillaMenor } from "../../../../utils/servicioGenerarWordDesdePlantillaMenor";
import { Download } from 'lucide-react';
import { useAuth } from "../../../../auth";

type Props = {
    requisicionDetalle: any;
    servicioDetalle: any;
    partidas: any[];
};

const txt = (v: any) =>
    v === null || v === undefined || v === '' ? '________________' : String(v);

const money = (v: any) => {
    const n = Number(v);
    if (!Number.isFinite(n)) return '________________';
    return n.toLocaleString('es-MX', {
        style: 'currency',
        currency: 'MXN',
    });
};

const caracter = (v: any) => {
    if (v === 0 || v === '0') return 'NACIONAL';
    if (v === 1 || v === '1') return 'INTERNACIONAL';
    return txt(v);
};

const modalidad = (v: any) => {
    if (v === 0 || v === '0') return 'FIJA';
    if (v === 1 || v === '1') return 'ABIERTA';
    if (typeof v === 'boolean') return v ? 'ABIERTA' : 'FIJA';
    return txt(v);
};





export function ServicioMenorDocumentoWordPreview({
    requisicionDetalle,
    servicioDetalle,
    partidas = [],
}: Props) {


const { user } = useAuth();
    const activeProfileLabel = user?.tipoPerfil ?? "SIN PERFIL";
    return (
        <DocumentoTabChrome actions={
                    <button
                        type="button"
                        onPointerDown={() => servicioGenerarWordDesdePlantillaMenor(requisicionDetalle, activeProfileLabel)}
                        className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                        Descargar Word
                    </button>
                }
            >
            
            <div className="min-h-screen bg-slate-200 py-6">		
                <div className="mx-auto w-[816px] min-h-[1056px] bg-white px-[72px] py-[56px] text-[12px] leading-relaxed text-black shadow-xl">
                    <div className="text-center font-bold uppercase leading-tight text-gray-700">
                            <p>H. AYUNTAMIENTO DE CUAUTLANCINGO</p>
                            <p>SECRETARÍA DE ADMINISTRACIÓN</p>
                            <p>DIRECCIÓN DE RECURSOS MATERIALES</p>

                            <p className="text-[15px] text-gray-800">
                                REQUISICIÓN
                            </p>
                        </div>

                    <table className="mt-6 w-full border-collapse text-[11px]">
                        <tbody>
                            <tr>
                                <td className="w-1/2 border border-black bg-gray-200 p-2 font-bold">
                                    UNIDAD SOLICITANTE:
                                </td>
                                <td className="border border-black p-2">
                                    {txt(requisicionDetalle?.unidadSolicitante)}
                                </td>
                            </tr>

                            <tr>
                                <td className="border border-black bg-gray-200 p-2 font-bold">
                                    NOMBRE DEL TITULAR Y/O SOLICITANTE:
                                </td>
                                <td className="border border-black p-2">
                                    {txt(requisicionDetalle?.nombreSolicitante)}
                                </td>
                            </tr>

                            <tr>
                                <td className="border border-black bg-gray-200 p-2 font-bold">
                                    CARGO DEL SOLICITANTE
                                </td>
                                <td className="border border-black p-2">
                                    {txt(requisicionDetalle?.cargoSolicitante)}
                                </td>
                            </tr>

                            <tr>
                                <td className="border border-black bg-gray-200 p-2 font-bold">
                                    FECHA DE SOLICITUD:
                                </td>
                                <td className="border border-black p-2">
                                    {txt(requisicionDetalle?.fechaSolicitudCadena)}
                                </td>
                            </tr>      

                            <tr>
                                <td className="border border-black bg-gray-200 p-2 font-bold">
                                    JUSTIFICACIÓN DEL GASTO:
                                </td>
                                <td className="border border-black p-2">
                                    {txt(requisicionDetalle?.justificacionGasto)}
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <table className=" w-full border-collapse text-[11px]">
                        <thead>
                            <tr className="font-bold">
                                <th className="border border-black bg-gray-200 p-2">
                                    NÚMERO DE PARTIDA
                                </th>

                                <th className="border border-black bg-gray-200 p-2">
                                    DESCRIPCIÓN
                                </th>

                                <th className="border border-black bg-gray-200 p-2">
                                    UNIDAD DE MEDIDA
                                </th>

                                <th className="border border-black bg-gray-200 p-2">
                                    CANTIDAD
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {partidas.length ? (
                                partidas.map((p, index) => (
                                    <tr key={p.id ?? index}>
                                        <td className="border border-black p-2 text-center">
                                            {p.numeroPartida ?? index + 1}
                                        </td>
                                        <td className="border border-black p-2 align-top">
                                            <div className="space-y-1">
                                                <p><strong>Descripción general:</strong> {txt(p.descripcionGeneral ?? p.descripcion)}</p>
                                                <p><strong>Descripción específica:</strong> {txt(p.descripcionEspecifica)}</p>
                                                <p><strong>Lugar y periodo de ejecución:</strong> {txt(p.lugarPeriodoEjecucionServicio)}</p>
                                                <p><strong>Personal requerido:</strong> {txt(p.personalRequerido)}</p>
                                                <p><strong>Entregables:</strong> {txt(p.entregablesNecesarios)}</p>
                                                <p><strong>Condiciones generales de contratación:</strong> {txt(p.condicionesGeneralesContratacion)}</p>
                                            </div>
                                        </td>
                                        <td className="border border-black p-2 text-center">
                                            {txt(p.unidadMedida)}
                                        </td>
                                        <td className="border border-black p-2 text-center">
                                            {txt(p.cantidad)}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td className="border border-black p-2 text-center">1</td>
                                    <td className="border border-black p-2">________________</td>
                                    <td className="border border-black p-2">________________</td>
                                    <td className="border border-black p-2">________________</td>
                                </tr>
                            )}
                        </tbody>
                    </table>					

                  



                    <table className="mt-16 w-full border-collapse text-[11px] uppercase">
                        <tbody>
                            <tr>
                                <td className="w-1/2 px-8 pb-12 text-center align-top">
                                    <div className="border-t border-black pt-2 font-bold">
                                        ELABORÓ
                                    </div>                                                                    
                                     <p className="mt-2 font-bold">
                                        {txt(requisicionDetalle?.nombreSolicitante) ?? '________________'}
                                    </p>
                                    <p className="mt-2 font-bold">
                                        DIRECTOR RESPONSABLE DE LA CONTRATACIÓN
                                    </p>
                                </td>

                                <td className="w-1/2 px-8 pb-12 text-center align-top">
                                    <div className="border-t border-black pt-2 font-bold">
                                        REVISÓ
                                    </div>

                                    <p className="mt-2 font-bold">
                                        VALENTÍN MARTÍNEZ NADER
                                        <br /> 
                                        DIRECTOR DE RECURSOS MATERIALES Y SERVICIOS GENERALES DEL HONORABLE AYUNTAMIENTO DEL MUNICIPIO DE CUAUTLANCINGO, PUEBLA.
                                    </p>
                                </td>
                            </tr>

                            <tr>
                                <td className="px-8 pt-12 text-center align-top">
                                    <div className="border-t border-black pt-2 font-bold">
                                        Vo. Bo.
                                    </div>

                                    <p className="mt-2 font-bold">
                                        GERMÁN DELÓN PAEZ
                                        <br />
                                        SECRETARIO DE ADMINISTRACIÓN DEL HONORABLE AYUNTAMIENTO DEL MUNICIPIO DE CUAUTLANCINGO, PUEBLA.
                                    </p>
                                </td>

                                <td className="px-8 pt-12 text-center align-top">
                                    <div className="border-t border-black pt-2 font-bold">
                                        AUTORIZÓ
                                    </div>

                                    <p className="mt-2 font-bold">
                                        LAURA BEATRIZ OLVERA POPOCA
                                        <br />
                                        TESORERA MUNICIPAL DEL HONORABLE AYUNTAMIENTO DEL MUNICIPIO DE CUAUTLANCINGO, PUEBLA.
                                    </p>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    
                </div>
            </div>
        </DocumentoTabChrome>
    );

    
}

