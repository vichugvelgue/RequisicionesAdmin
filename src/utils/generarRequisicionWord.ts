import {
	Document,
	Packer,
	Paragraph,
	Table,
	TableRow,
	TableCell,
	TextRun,
	WidthType,
	AlignmentType,
	BorderStyle,
	ShadingType,
    Header,
	ImageRun,
} from "docx";
import { saveAs } from "file-saver";

const txt = (value: any) => value ?? "";

const money = (value: any) => {
	if (value === null || value === undefined || value === "") return "";
	return Number(value).toLocaleString("es-MX", {
		style: "currency",
		currency: "MXN",
	});
};

const obtenerImagen = async (ruta: string) => {
	const response = await fetch(ruta);
	const blob = await response.blob();
	return await blob.arrayBuffer();
};

const celda = (
	texto: string,
	opciones?: {
		bold?: boolean;
		bg?: string;
		width?: number;
	}
) =>
	new TableCell({
		width: {
			size: opciones?.width ?? 50,
			type: WidthType.PERCENTAGE,
		},
		shading: opciones?.bg
			? {
					type: ShadingType.CLEAR,
					fill: opciones.bg,
			  }
			: undefined,
		borders: {
			top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
			bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
			left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
			right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
		},
		children: [
			new Paragraph({
				children: [
					new TextRun({
						text: texto,
						bold: opciones?.bold ?? false,
						size: 18,
					}),
				],
			}),
		],
	});

const fila = (label: string, value: string) =>
	new TableRow({
		children: [
			celda(label, {
				bold: true,
				bg: "D9D9D9",
				width: 50,
			}),
			celda(value, {
				width: 50,
			}),
		],
	});

    const celdaCentro = (texto: string, opciones?: { bold?: boolean; bg?: string; width?: number }) =>
	new TableCell({
		width: {
			size: opciones?.width ?? 25,
			type: WidthType.PERCENTAGE,
		},
		shading: opciones?.bg
			? {
					type: ShadingType.CLEAR,
					fill: opciones.bg,
			  }
			: undefined,
		borders: {
			top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
			bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
			left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
			right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
		},
		children: [
			new Paragraph({
				alignment: AlignmentType.CENTER,
				children: [
					new TextRun({
						text: texto,
						bold: opciones?.bold ?? false,
						size: 18,
					}),
				],
			}),
		],
	});

const crearTablaPartidas = (partidas: any[] = []) => {
	const rows: TableRow[] = [
		new TableRow({
			children: [
				celdaCentro("NÚMERO DE PARTIDA", { bold: true, bg: "D9D9D9", width: 18 }),
				celdaCentro("DESCRIPCIÓN", { bold: true, bg: "D9D9D9", width: 46 }),
				celdaCentro("UNIDAD DE MEDIDA", { bold: true, bg: "D9D9D9", width: 20 }),
				celdaCentro("CANTIDAD", { bold: true, bg: "D9D9D9", width: 16 }),
			],
		}),
	];

	if (partidas.length) {
		partidas.forEach((p, index) => {
			rows.push(
				new TableRow({
					children: [
						celdaCentro(String(p.numeroPartida ?? index + 1), { width: 18 }),
						celda(txt(p.descripcion ?? p.descripcionGeneral), { width: 46 }),
						celdaCentro(txt(p.unidadMedida), { width: 20 }),
						celdaCentro(txt(p.cantidad), { width: 16 }),
					],
				})
			);
		});
	} else {
		rows.push(
			new TableRow({
				children: [
					celdaCentro("1", { width: 18 }),
					celda("________________", { width: 46 }),
					celdaCentro("________________", { width: 20 }),
					celdaCentro("________________", { width: 16 }),
				],
			})
		);
	}

	return new Table({
		width: {
			size: 100,
			type: WidthType.PERCENTAGE,
		},
		rows,
	});
};

export const generarRequisicionWord = async (requisicionDetalle: any) => {
	const tablaDatosGenerales = new Table({
		width: {
			size: 100,
			type: WidthType.PERCENTAGE,
		},
		rows: [
			fila("UNIDAD SOLICITANTE:", txt(requisicionDetalle?.unidadSolicitante)),
			fila("NOMBRE DEL TITULAR Y/O SOLICITANTE:", txt(requisicionDetalle?.nombreSolicitante)),
			fila("CARGO DEL SOLICITANTE:", txt(requisicionDetalle?.cargoSolicitante)),
			fila("FECHA DE SOLICITUD:", txt(requisicionDetalle?.fechaSolicitud)),
			fila("CARÁCTER DEL PROCEDIMIENTO\n(NACIONAL/INTERNACIONAL):", txt(requisicionDetalle?.caracterProcedimiento)),
			fila("MODALIDAD DE CONTRATACIÓN\n(FIJA/ABIERTA):", txt(requisicionDetalle?.modalidadContratacion)),
			fila("PRESUPUESTO AUTORIZADO:", money(requisicionDetalle?.presupuestoAutorizado)),
			fila("CLAVE PRESUPUESTAL / OBJETO DE GASTO:", txt(requisicionDetalle?.clavePresupuestal)),
			fila("ORIGEN DEL RECURSO:", txt(requisicionDetalle?.origenRecurso)),
			fila("COMPONENTE:", txt(requisicionDetalle?.componente)),
			fila("ACTIVIDAD:", txt(requisicionDetalle?.actividad)),
			fila("TIPO DEL PROGRAMA:", txt(requisicionDetalle?.tipoPrograma)),
			fila("TIPO DE PROCEDIMIENTO:", txt(requisicionDetalle?.tipoProcedimiento)),
			fila("DESCRIPCIÓN GENERAL:", txt(requisicionDetalle?.descripcionGeneral)),
			fila("PERIODO DE GARANTÍA:", txt(requisicionDetalle?.periodoGarantia)),
			fila("JUSTIFICACIÓN DEL GASTO:", txt(requisicionDetalle?.justificacionGasto)),
		],
	});

    const fondoRequisicion = await obtenerImagen("/documentos/fondo-requisicion.png");
	const doc = new Document({
		sections: [            
			{
                headers: {
				default: new Header({
					children: [
						new Paragraph({
							alignment: AlignmentType.CENTER,
							children: [
								new ImageRun({
                                    type: "png",
									data: fondoRequisicion,
									transformation: {
										width: 612,
										height: 792,
									},
								}),
							],
						}),
					],
				}),
			},
				properties: {
					page: {
						margin: {
							top: 720,
							right: 720,
							bottom: 720,
							left: 720,
						},
					},
				},
				children: [
					new Paragraph({
						alignment: AlignmentType.CENTER,
						children: [
							new TextRun({
								text: "H. AYUNTAMIENTO DE CUAUTLANCINGO",
								bold: true,
								size: 22,
							}),
						],
					}),
					new Paragraph({
						alignment: AlignmentType.CENTER,
						children: [
							new TextRun({
								text: "SECRETARÍA DE ADMINISTRACIÓN",
								bold: true,
								size: 22,
							}),
						],
					}),
					new Paragraph({
						alignment: AlignmentType.CENTER,
						children: [
							new TextRun({
								text: "DIRECCIÓN DE RECURSOS MATERIALES",
								bold: true,
								size: 22,
							}),
						],
					}),
					new Paragraph({
						alignment: AlignmentType.CENTER,
						spacing: { before: 200, after: 300 },
						children: [
							new TextRun({
								text: "REQUISICIÓN",
								bold: true,
								size: 26,
							}),
						],
					}),

					tablaDatosGenerales,

                    new Paragraph({
                    spacing: { before: 300, after: 120 },
                    children: [
                        new TextRun({
                            text: "PARTIDAS",
                            bold: true,
                            size: 22,
                        }),
                    ],
                }),

                crearTablaPartidas(requisicionDetalle?.partidas ?? []),
				],
			},
		],
	});

	const blob = await Packer.toBlob(doc);
	saveAs(blob, "Requisicion.docx");
};