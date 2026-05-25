import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";

const txt = (value: any) => {
	if (value === null || value === undefined) return "";
	return String(value);
};

const fecha = (value: any) => {
	if (!value) return "";

	const date = new Date(value);

	if (Number.isNaN(date.getTime())) return txt(value);

	return date.toLocaleDateString("es-MX", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	});
};

export const generarBienesMenorWord = async (requisicionDetalle: any) => {
	const response = await fetch("/plantillas/requisicionbienesmenor.docx");
	const content = await response.arrayBuffer();

	const zip = new PizZip(content);

	const doc = new Docxtemplater(zip, {
		paragraphLoop: true,
		linebreaks: true,
	});

    console.log("Detalle de requisición:", requisicionDetalle);

	doc.render({
		unidadSolicitante: txt(requisicionDetalle?.unidadSolicitante),
		nombreSolicitante: txt(requisicionDetalle?.nombreSolicitante),
		cargoSolicitante: txt(requisicionDetalle?.cargoSolicitante),
		fechaSolicitud: fecha(requisicionDetalle?.fechaSolicitud),
		justificacionGasto: txt(requisicionDetalle?.justificacionGasto),

		partidas: (requisicionDetalle?.partidas ?? []).map((p: any, index: number) => ({
			numeroPartida: txt(p.numeroPartida ?? index + 1),
			descripcion: txt(p.descripcion),
			unidadMedida: txt(p.unidadMedida),
			cantidad: txt(p.cantidad),
		})),
	});

	const blob = doc.getZip().generate({
		type: "blob",
		mimeType:
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
	});

	saveAs(blob, "Requisicion-Bienes-Menor.docx");
};