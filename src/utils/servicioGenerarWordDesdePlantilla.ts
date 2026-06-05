import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";

export const servicioGenerarWordDesdePlantilla = async (
	requisicionDetalle: any
) => {

	const response = await fetch(`${import.meta.env.BASE_URL}/plantillas/requisicionserviciosmayor.docx`);

	const content = await response.arrayBuffer();

	const zip = new PizZip(content);

	const doc = new Docxtemplater(zip, {
		paragraphLoop: true,
		linebreaks: true,
	});    

	doc.render({
		unidadSolicitante:
			requisicionDetalle?.unidadSolicitante ?? "",
        
        articulo:
			requisicionDetalle?.articulo ?? "",

		nombreSolicitante:
			requisicionDetalle?.nombreSolicitante ?? "",

		cargoSolicitante:
			requisicionDetalle?.cargoSolicitante ?? "",
        
        fechaSolicitud:
			requisicionDetalle?.fechaSolicitud ?? "",

        caracterProcedimiento:
			requisicionDetalle?.caracterProcedimiento ?? "",

        modalidadContratacion:
			requisicionDetalle?.modalidadContratacion ?? "",
        
        presupuestoAutorizado:
			requisicionDetalle?.presupuestoAutorizado ?? "",

        clavePresupuestal:
			requisicionDetalle?.clavePresupuestal ?? "",

        origenRecurso:
			requisicionDetalle?.origenRecurso ?? "",

        componente:
			requisicionDetalle?.componente ?? "",

        actividad:
			requisicionDetalle?.actividad ?? "",

        tipoPrograma:
			requisicionDetalle?.tipoPrograma ?? "",

        tipoProcedimiento:
			requisicionDetalle?.tipoProcedimiento ?? "",

        descripcionGeneral  :
			requisicionDetalle?.descripcionGeneral ?? "",

        periodoGarantia:
			requisicionDetalle?.periodoGarantia ?? "",
        
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

        experienciaLicitante:
            requisicionDetalle?.experienciaLicitante ?? "",

        diasEntrega:
            requisicionDetalle?.diasEntrega ?? "",

        pagosSeRealizaran:
            requisicionDetalle?.pagosSeRealizaran ?? "",
        
        lugarEntrega:
            requisicionDetalle?.lugarEntrega ?? "",
        
        nombreRepresentante:
            requisicionDetalle?.nombreRepresentante ?? "",

        cargoRepresentante:
            requisicionDetalle?.cargoRepresentante ?? "",
        
        correoRepresentante:
            requisicionDetalle?.correoRepresentante ?? "",
        
        telefonoRepresentante:
            requisicionDetalle?.telefonoRepresentante ?? "",

        nombreAdministradorContrato:
            requisicionDetalle?.nombreAdministradorContrato ?? "",

        cargoAdministradorContrato:
            requisicionDetalle?.cargoAdministradorContrato ?? "",
        
        correoAdministradorContrato:
            requisicionDetalle?.correoAdministradorContrato ?? "",

        telefonoAdministradorContrato:
            requisicionDetalle?.telefonoAdministradorContrato ?? "",

         nombreDependenciaEntrega:
            requisicionDetalle?.nombreDependenciaEntrega ?? "",
        telefonoEntrega:
            requisicionDetalle?.telefonoEntrega ?? "",
        extencionTelefonoEntrega:
            requisicionDetalle?.extencionTelefonoEntrega ?? "",


	});

	const blob = doc.getZip().generate({
		type: "blob",
		mimeType:
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
	});

	saveAs(blob, "Requisicion.docx");
};