import React from 'react';
import { DocumentoTabChrome } from './DocumentoTabChrome';


import { generarWordDesdePlantilla } from "../../../../utils/generarWordDesdePlantilla";
import { Download } from 'lucide-react';

type Props = {
	requisicionDetalle: any;
	bienDetalle: any;
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





export function BienesMayorDocumentoWordPreview({
	requisicionDetalle,
	bienDetalle,
	partidas = [],
}: Props) {


	

	return (
		<DocumentoTabChrome actions={
					<button
						type="button"
						onClick={() => generarWordDesdePlantilla(requisicionDetalle)}
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
				{txt(requisicionDetalle?.fechaSolicitud)}
			</td>
		</tr>

		<tr>
			<td className="border border-black bg-gray-200 p-2 font-bold">
				CARÁCTER DEL PROCEDIMIENTO <br />
				(NACIONAL/INTERNACIONAL)
			</td>
			<td className="border border-black p-2">
				{txt(requisicionDetalle?.caracterProcedimiento)}
			</td>
		</tr>

		<tr>
			<td className="border border-black bg-gray-200 p-2 font-bold">
				MODALIDAD DE CONTRATACIÓN <br />
				(FIJA/ABIERTA)
			</td>
			<td className="border border-black p-2">
				{txt(requisicionDetalle?.modalidadContratacion)}
			</td>
		</tr>

		<tr>
			<td className="border border-black bg-gray-200 p-2 font-bold">
				PRESUPUESTO AUTORIZADO
			</td>
			<td className="border border-black p-2">
				{money(requisicionDetalle?.presupuestoAutorizado)}
			</td>
		</tr>

		<tr>
			<td className="border border-black bg-gray-200 p-2 font-bold">
				CLAVE PRESUPUESTAL / OBJETO DE GASTO
			</td>
			<td className="border border-black p-2">
				{txt(requisicionDetalle?.clavePresupuestal)}
			</td>
		</tr>

		<tr>
			<td className="border border-black bg-gray-200 p-2 font-bold">
				ORIGEN DEL RECURSO
			</td>
			<td className="border border-black p-2">
				{txt(requisicionDetalle?.origenRecurso)}
			</td>
		</tr>

		<tr>
			<td className="border border-black bg-gray-200 p-2 font-bold">
				COMPONENTE
			</td>
			<td className="border border-black p-2">
				{txt(requisicionDetalle?.componente)}
			</td>
		</tr>

		<tr>
			<td className="border border-black bg-gray-200 p-2 font-bold">
				ACTIVIDAD
			</td>
			<td className="border border-black p-2">
				{txt(requisicionDetalle?.actividad)}
			</td>
		</tr>

		<tr>
			<td className="border border-black bg-gray-200 p-2 font-bold">
				TIPO DEL PROGRAMA
			</td>
			<td className="border border-black p-2">
				{txt(requisicionDetalle?.tipoPrograma)}
			</td>
		</tr>

		<tr>
			<td className="border border-black bg-gray-200 p-2 font-bold">
				TIPO DE PROCEDIMIENTO
			</td>
			<td className="border border-black p-2">
				{txt(requisicionDetalle?.tipoProcedimiento)}
			</td>
		</tr>

		<tr>
			<td className="border border-black bg-gray-200 p-2 font-bold">
				DESCRIPCIÓN GENERAL:
			</td>
			<td className="border border-black p-2">
				{txt(requisicionDetalle?.descripcionGeneral)}
			</td>
		</tr>

		<tr>
			<td className="border border-black bg-gray-200 p-2 font-bold">
				PERIODO DE GARANTÍA
			</td>
			<td className="border border-black p-2">
				{txt(requisicionDetalle?.periodoGarantia)}
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
									<td className="border border-black p-2">________________</td>
									<td className="border border-black p-2">________________</td>
								</tr>
							)}
						</tbody>
					</table>					

					<table className=" w-full border-collapse text-[11px] border border-black">
				<tbody>
					<tr>
						<td className="border border-black bg-gray-200 p-2 text-center font-bold uppercase">
						REQUISITOS TÉCNICOS
					</td>
					</tr>

					<tr>
					<td className="border border-black p-3">
						<p className="text-justify">
							1.- Los licitantes deberán presentar currículo en hoja membretada
							debidamente firmada por la persona autorizada para ello y sellada,
							en el que indiquen su experiencia mínima de{' '}
							<strong>{txt(requisicionDetalle?.aniosExperienciaLicitante)}</strong>{' '}
							años en contrataciones iguales o similares a la requerida en el
							cual se incluya:
						</p>

						<p className="mt-3 text-justify">
							a) Relación en formato libre de mínimo tres contrataciones iguales
							o similares, que hayan sido efectuados durante los últimos años,
							sin exceder de tres; la cual deberá contener: nombre, domicilio y
							teléfono del cliente, monto de la venta o comercialización, así
							como indicar el destino público o privado.
						</p>

						<p className="mt-3 text-justify">
							Es importante señalar que dichos datos podrán ser verificados de
							manera aleatoria.
						</p>

						<p className="mt-3 text-justify">
							2.- Los licitantes deberán presentar lo siguiente:
						</p>

						<p className="mt-3 text-justify">
							a) Escrito libre en hoja membretada debidamente firmada por la
							persona autorizada para ello y sellada, donde indique un correo
							electrónico y número de teléfono para cualquier aclaración con
							atención las 24 horas de día de lunes a domingo.
						</p>

						<p className="mt-3 text-justify">
							b) Copia simple legible del comprobante de domicilio con una
							antigüedad no mayor a tres meses.
						</p>

						<p className="mt-3 text-justify">
							En caso de que el comprobante de domicilio no se encuentre a nombre
							del licitante, éste deberá presentar copia simple legible del
							contrato de arrendamiento, junto con copia simple legible de las
							identificaciones de los representantes legales que suscriban el
							contrato.
						</p>

						<p className="mt-3 text-justify">
							3.- Los licitantes deberán indicar en su propuesta técnica la
							marca, modelo y/o país de procedencia, en caso de aplicar.
						</p>

						<p className="mt-3 text-justify">
							En caso de que no aplique marca, los licitantes deberán indicar NO
							APLICA. Conforme al Anexo que se establezca en las bases o
							invitación correspondiente para presentar su propuesta técnica.
						</p>

						<p className="mt-3 text-justify">
							4.- Los licitantes deberán presentar carta bajo protesta de decir
							verdad, en hoja membretada debidamente firmada por la persona
							autorizada para ello y sellada, en la que se comprometa en caso de
							resultar adjudicado a lo siguiente:
						</p>

						<p className="mt-3 text-justify">
							a) A realizar la entrega de los bienes en el plazo y lugar señalado
							por la contratante.
						</p>

						<p className="mt-3 text-justify">
							b) A realizar el cambio al 100% de los bienes adjudicados que
							presenten vicios ocultos o que resulten dañados por defectos de
							empaque y/o transportación, a partir de su recepción en el almacén
							de la Contratante, estos le serán devueltos y deberán sustituirlos
							en un plazo no mayor a siete días naturales.
						</p>

						<p className="mt-3 text-justify">
							Se entiende por vicios ocultos cualquier inconsistencia que no
							pueda ser apreciable al momento de la recepción de los bienes.
						</p>

						<p className="mt-3 text-justify">
							c) A garantizar los bienes por un periodo mínimo de 1 año, contado
							a partir de la fecha de su recepción a entera satisfacción de la
							Contratante.
						</p>

						<p className="mt-3 text-justify">
							d) A apegarse estrictamente a las características y especificaciones
							técnicas establecidas en forma individual por cada una de las
							partidas solicitadas.
						</p>

						<p className="mt-3 text-justify">
							e) A asumir totalmente la responsabilidad legal, en el caso de que,
							al entregar los bienes, infrinja o viole las normas en materia de
							patentes, marcas, obligaciones fiscales, de comercio, registros,
							derechos de autor, constancia de calidad, certificados analíticos
							de producto terminado, así como el resto de los documentos
							inherentes a la entrega.
						</p>

						<p className="mt-3 text-justify">
							f) A garantizar la entrega de los bienes dentro de{' '}
							<strong>{txt(requisicionDetalle?.diasEntrega)}</strong> días naturales,
							durante la vigencia del contrato; asimismo, en caso de desabasto en
							el mercado o cualquier otro motivo, notificar mediante el correo
							electrónico en un plazo no mayor de 3 días naturales posteriores a
							la remisión del pedido, y contará con 7 días naturales posteriores
							a la notificación para cubrir el faltante.
						</p>

						<p className="mt-3 text-justify">
							5.- Los licitantes deberán presentar carta bajo protesta de decir verdad
							en hoja membretada, debidamente firmada por la persona autorizada para
							ello y sellada, donde se comprometa en caso de resultar adjudicado a lo
							siguiente:
						</p>

						<p className="mt-3 text-justify">
							A) A que aceptan y reconocen que toda la información, datos o
							documentación, que le sea proporcionada por la contratante, así como
							aquella a la que llegase a tener acceso, será considerada como
							confidencial, por lo que se obliga a mantener absoluta discreción y
							confidencialidad respecto de cualquier tipo de información, datos o
							documentación, así como a obligar a sus trabajadores y/o empleados a
							mantener en los mismos términos de discreción tales aspectos
							confidenciales y a no revelar a terceros el secreto profesional, la
							información comercial referente a los productos, marcas, patentes y/o
							secreto industrial de los que tengan o lleguen a tener conocimiento con
							motivo de la celebración del presente instrumento; datos personales en
							Términos de la normatividad en materia de protección de datos
							personales; información patrimonial o de operación; misma que se
							considerará como confidencial en términos de lo dispuesto por los
							artículos 116 de la Ley General de Transparencia y Acceso a la
							Información Pública; 7 fracción XVII, 11 y 134 de la Ley de
							Transparencia y Acceso a la Información Pública del Estado de Puebla.
						</p>

						<p className="mt-3 text-justify">
							B) A que el manejo de la información confidencial incluye de manera
							enunciativa más no limitativa, lo siguiente:
						</p>

						<p className="mt-3 text-justify">
							I. La obligación de no divulgar la información confidencial a terceras
							personas sin el consentimiento por escrito de la contratante.
						</p>

						<p className="mt-3 text-justify">
							II. La obligación de no usar la información confidencial para beneficio
							propio o de terceras personas, debiendo utilizarla exclusivamente con el
							propósito de cumplir con la entrega de los bienes encomendados.
						</p>

						<p className="mt-3 text-justify">
							III. La obligación de no llevar a cabo ninguna acción que pueda llegar a
							comprometer o poner en riesgo la información, datos o documentación, que
							le sea proporcionada por los trabajadores o por la contratante.
						</p>

						<p className="mt-3 text-justify">
							IV. La obligación permanente de abstenerme de utilizar la información a
							la que tenga acceso con motivo de la celebración del presente
							instrumento, así como aquella que se genere con motivo de la ejecución
							del contrato respectivo; en perjuicio de la contratante.
						</p>

						<p className="mt-3 text-justify">
							V. La obligación de abstenerme durante la vigencia del contrato
							respectivo de generar por medios propios o a través de terceros, actos o
							acciones que en forma alguna perjudiquen, demeriten, difamen,
							calumnien u ofendan la imagen pública de la contratante.
						</p>

						<p className="mt-3 text-justify">
							El incumplimiento a lo dispuesto en la presente dará lugar a la
							rescisión inmediata del contrato; en el entendido de que los
							representantes legales, empleados, asesores y/o prestadores de
							servicios, únicamente podrán hacer uso de la información contenida en el
							instrumento jurídico para el cumplimiento de sus funciones, sin que ello
							se entienda como una violación a la confidencialidad.
						</p>

						<p className="mt-3 text-justify">
							Para efectos de lo anterior, se considerará como información
							confidencial, toda aquella documentación e información de carácter
							industrial, comercial, operativa, contable, legal, financiera,
							corporativa, de mercadotecnia, de ventas, métodos, procesos, formas de
							distribución, comercialización, formulas, técnicas, productos,
							maquinarias, mejoras, diseños, descubrimientos, estudios,
							compilaciones, programas de software, hardware, folletos, gráficas, o
							cualquier otro tipo de información, propiedad de la contratante a la
							que tenga acceso el adjudicado misma que podrá constar en documentos,
							formulas, cintas magnéticas, documentos impresos, medios electrónicos
							de cualquier tipo, programas de computadora, disquetes, discos
							magnéticos, películas o cualquier otro material o instrumentos
							similares que retengan información técnica, financiera, de
							mercadotecnia, de análisis, compilaciones, estudios, gráficas,
							información contable, legal o de cualquier otro tipo.
						</p>

						<p className="mt-3 text-justify">
							6.- Los licitantes deberán incluir en su propuesta técnica, constancia de inscripción en el padrón de proveedores del Municipio de CUAUTLANCINGO Puebla, vigente; en caso de no contar con registro vigente, los licitantes deberán presentar carta bajo protesta de decir verdad que, en caso de resultar adjudicados se comprometen a inscribirse en dicho Padrón durante la vigencia del contrato. (copia simple legible).
						</p>

						<p className="mt-3 text-justify">
							7.- Declaración de no encontrarse en ninguno de los supuestos previstos por el artículo 77 de la Ley de Adquisiciones, Arrendamientos y Servicios del Sector Público Estatal y Municipal, mediante carta original en hoja membretada, dirigida a la a la Convocante, indicando el número de procedimiento, la cual deberá estar debidamente foliada, sellada (obligatorio en caso de ser persona moral), suscrita y firmada en original por el representante legal o persona autorizada para ello, en la que manifieste bajo protesta de decir verdad que:
						</p>

					<p className="mt-4 font-bold">PARA PERSONA FÍSICA:</p>

						<p className="mt-2 text-justify">
							I. Que no me encuentro en ninguno de los supuestos previstos por el
							artículo 77 de la Ley de Adquisiciones, Arrendamientos y Servicios del
							Sector Público Estatal y Municipal.
						</p>

						<p className="mt-2 text-justify">
							II. Que conozco el contenido y los requisitos que establece la Ley de
							Adquisiciones, Arrendamientos y Servicios del Sector Público Estatal y
							Municipal.
						</p>

						<p className="mt-2 text-justify">
							III. Que no me encuentro suspendido, cancelado, o inhabilitado por
							resolución de la Contraloría Municipal, para formalizar contrato alguno
							derivado de procedimientos de adjudicación de bienes, arrendamientos o
							servicios.
						</p>

						<p className="mt-2 text-justify">
							IV. Que conozco el contenido y alcances de la invitación que rige el
							presente procedimiento de adjudicación.
						</p>

						<p className="mt-4 font-bold">PARA PERSONA MORAL:</p>

						<p className="mt-2 text-justify">
							I. Cuento con facultades suficientes para suscribir a nombre de mi
							representada la propuesta correspondiente.
						</p>

						<p className="mt-2 text-justify">
							II. Que el poder con el que acredito mi representación no me ha sido
							revocado ni limitado en forma alguna.
						</p>

						<p className="mt-2 text-justify">
							III. Que no me encuentro en ninguno de los supuestos previstos por el
							artículo 77 de la Ley de Adquisiciones, Arrendamientos y Servicios del
							Sector Público Estatal y Municipal.
						</p>

						<p className="mt-2 text-justify">
							IV. Que conozco el contenido y los requisitos que establece la Ley de
							Adquisiciones, Arrendamientos y Servicios del Sector Público Estatal y
							Municipal.
						</p>

						<p className="mt-2 text-justify">
							V. Que no me encuentro suspendido, cancelado, o inhabilitado por
							resolución de la Contraloría Municipal, para formalizar contrato alguno
							derivado de procedimientos de adjudicación de bienes, arrendamientos o
							servicios.
						</p>

						<p className="mt-2 text-justify">
							VI. Que mi representado conoce el contenido y alcances de la invitación
							que rige el presente procedimiento de adjudicación.
						</p>
					</td>
			</tr>
		</tbody>
	</table>

<table className=" w-full border-collapse text-[11px] border border-black">
	<tbody>
		<tr>
			<td className="border border-black bg-gray-200 p-2 text-center font-bold uppercase">
				REQUISITOS ECONÓMICOS
			</td>
		</tr>

		<tr>
			<td className="border border-black p-3">
				<p className="text-justify">
					1. Los licitantes deberán presentar junto con su propuesta económica,
					copia simple legible de su última declaración anual presentada con su
					respectivo acuse de recibo de la Servicio de Administración Tributaria
					(SAT) con el sello o liga digital correspondiente, y la última
					declaración provisional presentada (ISR e IVA) del mes inmediato
					anterior a la presentación de la proposición.
				</p>

				<p className="mt-3 text-justify">
					2. Los licitantes deberán presentar junto con su propuesta económica
					copia simple legible de la Opinión de Cumplimiento de obligaciones
					fiscales en sentido positivo emitida por la Servicio de Administración
					Tributaria (SAT), con el sello o liga digital correspondiente, dicho
					documento deberá haber sido expedido dentro de los 30 días naturales
					previos a la presentación de la propuesta.
				</p>

				<p className="mt-3 text-justify">
					3. Los licitantes deberán presentar su propuesta económica, Conforme al
					Anexo que se establezca en las bases o invitación correspondiente para
					presentar su propuesta económica.
				</p>

				<p className="mt-3 text-justify">
					4. El criterio de adjudicación será en favor de aquel licitante que
					cumpla con los requisitos legales técnicos, económicos, y que oferten
					el precio más bajo por la totalidad de las partidas.
				</p>

				<p className="mt-3 text-justify">
					5. Los pagos se realizarán{' '}
					<strong>{txt(requisicionDetalle?.pagosSeRealizaran)}</strong>, durante la
					vigencia del contrato respectivo, mediante trasferencia electrónica,
					dentro de los diez días hábiles posteriores a la presentación de las
					facturas, mismas que deberán estar debidamente requisitadas, posterior
					a la entrega de los bienes a entera satisfacción de la Contratante.
				</p>

				<p className="mt-3 text-justify">
						6. Datos de facturación:
					</p>

					<div className="mt-4 flex justify-center">
						<div className="inline-block text-[11px]">
							<p className="font-bold">
								NOMBRE: MUNICIPIO DE CUAUTLANCINGO PUEBLA.
							</p>

							<p className="mt-1 font-bold">
								R.F.C.: MCP850101944.
							</p>

							<p className="mt-1 font-bold">
								DIRECCIÓN: PALACIO MUNICIPAL, SIN NÚMERO, CÓDIGO POSTAL 72700,
								CUAUTLANCINGO, PUEBLA.
							</p>
						</div>
					</div>

				<p className="mt-3 text-justify">
					7. Los licitantes deberán presentar junto con su propuesta económica,
					documento vigente con una antigüedad no mayor a 30 días naturales,
					expedido por el Instituto Mexicano del Seguro Social (IMSS) sobre la
					opinión de cumplimiento de obligaciones fiscales en materia de seguridad
					social en sentido positivo; la cual deberá tramitar el licitante en la
					página www.imss.gob.mx
				</p>

				<p className="mt-3 text-justify">
					8.- Los licitantes deberán presentar junto con su propuesta económica
					documento emitido por el Instituto del Fondo Nacional de la Vivienda
					para los Trabajadores (INFONAVIT), con antigüedad no mayor a 30 días
					naturales en el que se hará constar que el licitante no tiene adeudos
					con el organismo, firmado por el representante legal; en términos del
					acuerdo del H. Consejo de Administración del Instituto del Fondo
					Nacional de la Vivienda para los Trabajadores (INFONAVIT) por el que se
					emiten las reglas para la obtención de la constancia de situación fiscal
					en materia de aportaciones patronales y entero de descuentos, publicado
					en el diario oficial de la federación de fecha 28 de junio de 2017.
				</p>
			</td>
		</tr>
	</tbody>
</table>

	<table className=" w-full border-collapse text-[11px] border border-black">
		<tbody>
			<tr>
				<td className="border border-black bg-gray-200 p-2 text-center font-bold uppercase">
					REQUISITOS INFORMATIVOS
				</td>
			</tr>

			<tr>
				<td className="border border-black p-3">
					<p className="text-justify">
						1. Los licitantes interesados en participar en procedimientos de adjudicación deberán presentar Constancia de No Adeudo, expedida por el Honorable Ayuntamiento de CUAUTLANCINGO o carta compromiso de conformidad con lo establecido por el artículo 19 fracción II, inciso i) de la Ley de Ingresos del Municipio de CUAUTLANCINGO para el ejercicio fiscal 2026 (con copia simple legible).
					</p>

					<p className="mt-3 text-justify">
						2. La adquisición se llevará a cabo mediante contrato{' '}
						<strong>
							{txt(requisicionDetalle?.adquisicionMedianteContrato)}
						</strong>{' '}
						de conformidad a lo establecido en el artículo{' '}
						<strong>{txt(requisicionDetalle?.conformidadArticulo)}</strong> de la Ley de
						Adquisiciones, Arrendamiento, y Servicios del Sector Público Estatal y
						Municipal, por lo que la contratante está obligada a la adquisición de
						las cantidades mínimas requeridas, quedando las máximas sujetas a las
						necesidades de la misma y suficiencia presupuestal de la Contratante.
					</p>

					<p className="mt-3 text-justify">
						3. Los bienes adjudicados deberán entregarse en{' '}
						<strong>{txt(requisicionDetalle?.lugarEntrega)}</strong>, en un horario de
						9:00 A 15:00 horas de lunes a viernes en días hábiles con el Jefe del
						Departamento (Homólogo y/o Superior) de <strong>{txt(requisicionDetalle?.nombreDependenciaEntrega)}</strong>,
						en el número <strong>{txt(requisicionDetalle?.telefonoEntrega)}</strong> ext. <strong>{txt(requisicionDetalle?.extencionTelefonoEntrega)}</strong>, previa cita.
					</p>

					<p className="mt-3 text-justify">
						4. La entrega de bienes solicitados deberá realizarse dentro de los{' '}
						<strong>{txt(requisicionDetalle?.diasEntrega)}</strong> días naturales,
						posteriores a cada solicitud remitida por correo electrónico al
						Proveedor, durante la vigencia del contrato y será en el domicilio
						señalado.
					</p>
					<p className="mt-3 text-justify">
						Para efectos de la entrega correspondiente en caso sea en día inhábil
						o festivo la entrega se efectuará al siguiente día hábil.
					</p>

					<p className="mt-3 text-justify">
						5. Documentos para la formalización del contrato (original y dos copias
						simples legibles).
					</p>

					<p className="mt-3 text-justify">
						A) Garantía de cumplimiento de contrato y vicios ocultos.
					</p>

					<p className="mt-3 text-justify">
						B) Constancia de situación fiscal con una antigüedad de expedición no
						mayor a tres meses.
					</p>

					<p className="mt-3 text-justify">
						C) Acta constitutiva de la persona jurídica o acta de nacimiento en
						caso de ser persona física. Para el caso de que la persona moral haya
						tenido modificaciones a su acta constitutiva, deberá presentar las
						últimas modificaciones correspondientes.
					</p>

					<p className="mt-3 text-justify">
						D) Poder notarial del representante o apoderado legal, en caso de ser
						persona moral.
					</p>

					<p className="mt-3 text-justify">
						E) Identificación oficial vigente con fotografía del licitante; o bien,
						tratándose de personas morales, identificación oficial vigente con
						fotografía del apoderado o representante legal.
					</p>

					<p className="mt-3 text-justify">
						F) Comprobante de domicilio con una antigüedad no mayor a tres meses.
					</p>

					<p className="mt-3 text-justify">
						G) Constancia de Inscripción al Padrón de Proveedores del Municipio de
						CUAUTLANCINGO, Puebla, vigente; en caso de no contar con registro en el
						Padrón, el licitante que resulte adjudicado deberá presentar carta bajo
						protesta de decir verdad que, en caso de resultar adjudicado se
						compromete a inscribirse en dicho Padrón durante la vigencia del
						contrato.
					</p>

					<p className="mt-3 text-justify">
						H) Constancia de No Adeudo, expedida por el Honorable Ayuntamiento de
						CUAUTLANCINGO de conformidad con lo establecido por el artículo 19
						fracción II, inciso i) de la Ley de Ingresos del Municipio de
						CUAUTLANCINGO para el ejercicio fiscal 2026.
					</p>

					<p className="mt-3 text-justify">
						I) Documento vigente con una antigüedad no mayor a 30 días naturales,
						expedido por el Instituto Mexicano del Seguro Social (IMSS) sobre la
						opinión de cumplimiento de obligaciones fiscales en materia de seguridad
						social en sentido positivo; la cual deberá tramitar el licitante en la
						página www.imss.gob.mx
					</p>

					<p className="mt-3 text-justify">
						J) Documento emitido por el Instituto del Fondo Nacional de la Vivienda
						para los Trabajadores (INFONAVIT), con antigüedad no mayor a 30 días
						naturales en el que se hará constar que el licitante adjudicado no
						tiene adeudos con el organismo, firmado por el representante legal; en
						términos del acuerdo del H. Consejo de administración del Instituto del
						Fondo Nacional de la Vivienda para los Trabajadores (INFONAVIT) por el
						que se emiten las reglas para la obtención de la constancia de
						situación fiscal en materia de aportaciones patronales y entero de
						descuentos, publicado en el Diario Oficial de la Federación de fecha 28
						de junio de 2017.
					</p>

					<p className="mt-3 text-justify">
						K) Opinión de cumplimiento de obligaciones fiscales en sentido positivo,
						emitida por el Servicio de administración Tributaria (SAT), con el
						sello o liga digital correspondiente, dicho documento deberá haber sido
						expedido dentro de los 30 días naturales previos a la presentación de
						la propuesta.
					</p>

					<p className="mt-3 text-justify">
						Todos los documentos solicitados en este numeral, también deberán ser
						presentados en dispositivo de almacenamiento USB.
					</p>

					<p className="mt-3 text-justify">
						6. No se aceptará la participación conjunta.
					</p>

					<p className="mt-3 text-justify">
						7. La descripción y requisitos que se plasman en la presente
						requisición derivan de la solicitud efectuada por la contratante, por
						lo que el Representante para esta requisición y para efectos del
						procedimiento de contratación, así como los actos que resulten del
						mismo, serán:
					</p>

					<div className="mt-4">
					<p className=" font-bold uppercase">
						REPRESENTANTE
					</p>

					<div className="mt-4 space-y-2 text-[11px]">
						<div className="flex items-end">
							<span className="w-[140px] font-bold">Nombre:</span>

							<span className="flex-1 border-b border-black px-2">
								{txt(requisicionDetalle?.nombreRepresentante)}
							</span>
						</div>

						<div className="flex items-end">
							<span className="w-[140px] font-bold">Cargo:</span>

							<span className="flex-1 border-b border-black px-2">
								{txt(requisicionDetalle?.cargoRepresentante)}
							</span>
						</div>

						<div className="flex items-end">
							<span className="w-[140px] font-bold">
								Correo electrónico:
							</span>

							<span className="flex-1 border-b border-black px-2">
								{txt(requisicionDetalle?.correoRepresentante)}
							</span>
						</div>

						<div className="flex items-end">
							<span className="w-[140px] font-bold">Teléfono:</span>

							<span className="flex-1 border-b border-black px-2">
								{txt(requisicionDetalle?.telefonoRepresentante)}
							</span>
						</div>
					</div>
				</div>
					<p className="mt-4 text-justify">
						8. La contratante nombra para efectos de la contratación y
						suscripción del contrato al Administrador y Verificador, siendo
						los siguientes:
					</p>

					<div className="mt-6">
						<p className=" font-bold uppercase">
							ADMINISTRADOR DEL CONTRATO
						</p>

						<div className="mt-4 space-y-2 text-[11px]">
							<div className="flex items-end">
								<span className="w-[140px] font-bold">Nombre:</span>

								<span className="flex-1 border-b border-black px-2">
									{txt(requisicionDetalle?.nombreAdministradorContrato)}
								</span>
							</div>

							<div className="flex items-end">
								<span className="w-[140px] font-bold">Cargo:</span>

								<span className="flex-1 border-b border-black px-2">
									{txt(requisicionDetalle?.cargoAdministradorContrato)}
								</span>
							</div>

							<div className="flex items-end">
								<span className="w-[140px] font-bold">
									Correo electrónico:
								</span>

								<span className="flex-1 border-b border-black px-2">
									{txt(requisicionDetalle?.correoAdministradorContrato)}
								</span>
							</div>

							<div className="flex items-end">
								<span className="w-[140px] font-bold">Teléfono:</span>

								<span className="flex-1 border-b border-black px-2">
									{txt(requisicionDetalle?.telefonoAdministradorContrato)}
								</span>
							</div>
						</div>
					</div>

					<p className="mt-3 text-justify">
						El Administrador del contrato deberá supervisar la entrega de los bienes, así mismo realizar las visitas e inspecciones que estime pertinentes, igualmente podrá solicitar al proveedor, todos los datos e informes relacionados con los actos de que se trate, la Contratante estará obligada a permitir el acceso a los almacenes bodegas o lugares en los que se encuentren los bienes. 
					</p>

					<p className="mt-3 text-justify">
						El administrador del contrato, podrá solicitar la suspensión o cancelación del registro del licitante o proveedor en el padrón respectivo e inhabilitarlo temporalmente para participar en procedimientos de adjudicación o celebrara contratos regulados por la Ley de Adquisiciones, Arrendamientos y Servicios del Sector Público Estatal y Municipal, en los casos de incumplimiento de las obligaciones contractuales y que, como consecuencia, causen daños o perjuicios graves a la entidad contratante, así como aquellos que entreguen bienes con especificaciones distintas de las convenidas de conformidad con el artículo 136 de la Ley en la materia; asimismo, supervisará que los bienes se hayan entregado en tiempo y forma y cumplan con la calidad y especificaciones estipuladas en la descripción de las partidas.
					</p>

					<p className="mt-3 text-justify">
						En caso de que la persona designada como Administrador ya no se encuentre en el cargo, deberá firmar el jefe inmediato o el que para la fecha de suscripción del contrato ocupe el cargo.
					</p>

					<p className="mt-3 text-justify">
						9. Las penas convencionales se aplicarán por causas imputadas al licitante adjudicado, cuando existan retrasos en, la entrega de los bienes conforme a:
					</p>

					<p className="mt-3 text-justify">
						El 0.5% por el monto total correspondiente a los bienes no entregados
						(sin incluir I.V.A.) y por cada día natural de retraso, a partir del
						día siguiente, posterior a la fecha pactada para la entrega; mismo que
						será deducido a través de cheque certificado, de caja o nota de
						Crédito. Dicho documento deberá estar a nombre de:{' '}
						<strong>
							LA TESORERÍA MUNICIPAL DEL HONORABLE AYUNTAMIENTO DEL MUNICIPIO DE
							CUAUTLANCINGO, PUEBLA
						</strong>{' '}
						y deberá ser presentado previamente a la entrega de la facturación. No
						pudiendo rebasar la suma de la aplicación de las penas convencionales
						el diez por ciento del monto total del contrato; ya que, en caso de
						rebasar tal porcentaje, la contratante podrá rescindir el contrato,
						total o parcialmente, según sea el caso, haciendo efectiva la póliza de
						garantía y podrá adjudicar el contrato al segundo lugar.
					</p>

					<p className="mt-3 text-justify">
						En caso de que la Contratante autorice una prórroga, por causas imputables al licitante adjudicado, durante la misma, se aplicará la sanción establecida en este punto por cada día de prórroga.
					</p>

					<p className="mt-3 text-justify">
						En ningún caso el monto de las penas convencionales será superior, en su conjunto, al monto de la garantía de cumplimiento del contrato. Aplicación de las sanciones estipuladas en la ley.

					</p>
				</td>
			</tr>
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
					DIRECTOR DE RECURSOS MATERIALES DEL HONORABLE AYUNTAMIENTO DE CUAUTLANCINGO, PUEBLA.
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
					SECRETARIO DE ADMINISTRACIÓN DEL HONORABLE AYUNTAMIENTO DE CUAUTLANCINGO, PUEBLA.
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

					<p className="mt-10 text-[10px] font-bold">
						NOTA: Los elementos resaltados deberán ser requisitados de
						conformidad con las necesidades de la unidad requirente misma que
						deberá ser validada por la Dirección de Recursos Materiales.
					</p>
				</div>
			</div>
		</DocumentoTabChrome>
	);

	
}

