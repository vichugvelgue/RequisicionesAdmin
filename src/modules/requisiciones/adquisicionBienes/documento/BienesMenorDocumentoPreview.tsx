import { DocumentoTabChrome } from "./DocumentoTabChrome";
import { generarBienesMenorWord } from "../../../../utils/generarBienesMenorWord";
import { useAuth } from "../../../../auth";

const txt = (v: any) =>
	v === null || v === undefined || v === "" ? "________________" : String(v);

const fecha = (v: any) => {
	if (!v) return "________________";

	const date = new Date(v);

	if (Number.isNaN(date.getTime())) return String(v);

	return date.toLocaleDateString("es-MX", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	});
};

type Props = {
	requisicionDetalle: any;
};



export default function BienesMenorDocumentoPreview({
	requisicionDetalle,
}: Props) {
	console.log("BienesMenorDocumentoPreview - requisicionDetalle:", requisicionDetalle);
	const partidas = requisicionDetalle?.partidas ?? [];

	const { user } = useAuth();
	const activeProfileLabel = user?.tipoPerfil ?? "SIN PERFIL";

	return (
		<DocumentoTabChrome
			actions={
				<button
					type="button"
					onPointerDown={() => generarBienesMenorWord(requisicionDetalle, activeProfileLabel)}
					className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
				>
					Descargar Word
				</button>
			}
		>
			<div className="min-h-screen bg-slate-200 py-6">
				<div className="mx-auto w-[816px] min-h-[1056px] bg-white px-[72px] py-[56px] text-[12px] leading-relaxed text-black shadow-xl">
					<div className="text-center font-bold uppercase leading-tight text-gray-700">
						<p>H. AYUNTAMIENTO DE CUAUTLANCINGO</p>
						<p>SECRETARÍA DE ADMINISTRACIÓN</p>
						<p>DIRECCIÓN DE RECURSOS MATERIALES Y SERVICIOS GENERALES</p>
						<p className="mt-2 text-[15px] text-gray-800">REQUISICIÓN</p>
					</div>

					<table className="mt-8 w-full border-collapse text-[11px]">
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
									NOMBRE DEL TITULAR <br />
									Y/O SOLICITANTE:
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

					<table className="mt-6 w-full border-collapse text-[11px]">
						<thead>
							<tr className="font-bold">
								<th className="border border-black bg-gray-200 p-2">
									NÚMERO DE PARTIDA
								</th>
								<th className="border border-black bg-gray-200 p-2">
									DESCRIPCIÓN
								</th>
								<th className="border border-black bg-gray-200 p-2">
									UNIDAD DE <br />
									MEDIDA
								</th>
								<th className="border border-black bg-gray-200 p-2">
									CANTIDAD
								</th>
							</tr>
						</thead>

						<tbody>
							{partidas.length ? (
								partidas.map((p: any, index: number) => (
									<tr key={p.id ?? index}>
										<td className="border border-black p-2 text-center">
											{txt(p.numeroPartida ?? index + 1)}
										</td>
										<td className="border border-black p-2">
											{txt(p.descripcion ?? p.descripcionGeneral)}
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
									<td className="border border-black p-2 text-center">
										________________
									</td>
									<td className="border border-black p-2 text-center">
										________________
									</td>
								</tr>
							)}
						</tbody>
					</table>

					<div className="mt-14 grid grid-cols-2 gap-8 text-center text-[11px]">
						<div>
							<p className="font-bold">ELABORÓ</p>
							<div className="h-20" />
							<p className="border-t border-black pt-2 font-bold">
								{txt(requisicionDetalle?.nombreSolicitante)}
							</p>
							<p>
								(DIRECTOR RESPONSABLE DE LA CONTRATACIÓN)
							</p>
						</div>

						<div>
							<p className="font-bold">REVISÓ</p>
							<div className="h-20" />
							<p className="border-t border-black pt-2 font-bold">
								VALENTÍN MARTÍNEZ NADER
							</p>
							<p>
								DIRECTOR DE RECURSOS MATERIALES Y SERVICIOS GENERALES DEL
								HONORABLE AYUNTAMIENTO DE CUAUTLANCINGO, PUEBLA.
							</p>
						</div>
					</div>

					<div className="mt-12 grid grid-cols-2 gap-8 text-center text-[11px]">
						<div>
							<p className="font-bold">Vo. Bo.</p>
							<div className="h-20" />
							<p className="border-t border-black pt-2 font-bold">
								GERMÁN DELÓN PÁEZ
							</p>
							<p>
								SECRETARIO DE ADMINISTRACIÓN DEL HONORABLE AYUNTAMIENTO DE
								CUAUTLANCINGO, PUEBLA.
							</p>
						</div>

						<div>
							<p className="font-bold">AUTORIZÓ</p>
							<div className="h-20" />
							<p className="border-t border-black pt-2 font-bold">
								LAURA BEATRIZ OLVERA POPOCA
							</p>
							<p>
								TESORERA MUNICIPAL DEL HONORABLE AYUNTAMIENTO DEL MUNICIPIO DE
								CUAUTLANCINGO, PUEBLA.
							</p>
						</div>
					</div>

					<p className="mt-10 text-[10px] leading-snug">
						<span className="font-bold">NOTA:</span> Los elementos resaltados deberán ser
						requisitados de conformidad con las necesidades de la unidad requirente misma
						que deberá ser validada por la Dirección de Recursos Materiales.
					</p>

					<p className="mt-6 text-right text-[10px] text-gray-600">
						Página 1 | 1
					</p>
				</div>
			</div>
		</DocumentoTabChrome>
	);
}