import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";

export const servicioGenerarWordDesdePlantillaMenor = async (
    requisicionDetalle: any
) => {

    const response = await fetch(`${import.meta.env.BASE_URL}/plantillas/requisicionserviciosmenor.docx`);

    const content = await response.arrayBuffer();

    const zip = new PizZip(content);

    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
    });    

    doc.render({
        unidadSolicitante:
            requisicionDetalle?.unidadSolicitante ?? "",            

        nombreSolicitante:
            requisicionDetalle?.nombreSolicitante ?? "",

        cargoSolicitante:
            requisicionDetalle?.cargoSolicitante ?? "",
        
        fechaSolicitud:
            requisicionDetalle?.fechaSolicitud ?? "",

        justificacionGasto:
            requisicionDetalle?.justificacionGasto ?? "",

        partidas: (requisicionDetalle?.partidas ?? []).map((p: any, index: number) => ({
            numeroPartida: p.numeroPartida ?? index + 1,
            descripcion: p.descripcion ?? p.descripcionGeneral ?? "",
            descripcionEspecifica: p.descripcionEspecifica ?? "",
            lugarPeriodoEjecucionServicio: p.lugarPeriodoEjecucionServicio ?? "",
            personalRequerido: p.personalRequerido ?? "",
            entregablesNecesarios: p.entregablesNecesarios ?? "",
            condicionesGeneralesContratacion: p.condicionesGeneralesContratacion ?? "",
            unidadMedida: p.unidadMedida ?? "",
            cantidad: p.cantidad ?? "",
        })),      


    });

    const blob = doc.getZip().generate({
        type: "blob",
        mimeType:
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    saveAs(blob, "Requisicion.docx");
};