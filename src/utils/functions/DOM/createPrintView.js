import tableTypes from "../../../types/db/tables.types.js";

export const validateElement = (element, condition) => {
  return condition && condition !== tableTypes.UNKNOWN ? element : "";
};

const createPrintView = (elements) => {
  let HTML = "";

  for (let { sender = {}, destination = {} } of elements) {
    const {
      name: s_title,
      phoneNumber: s_phoneNumber,
      nit: s_nit,
      city: s_city,
      transporter: s_selectTransporter,
      locationDescription: s_locationDescription,
      draw: s_draw = ""
    } = sender || {};
    const {
      name: t_title,
      phoneNumber: t_phoneNumber,
      nit: t_nit,
      city: t_city,
      locationDescription: t_locationDescription
    } = destination || {};
    HTML += `
    <section class="container">
      <div>
      <div>
      <div>
      <h2>Remitente</h2>
      ${validateElement(`<h4>Nit: ${s_nit}</h4>`, s_nit)}
      </div>
      ${validateElement(`<p><strong>Empresa:</strong> ${s_title}</p>`, s_title)}
      ${validateElement(`<p><strong>Telefono:</strong> ${s_phoneNumber}</p>`, s_phoneNumber)}
      ${validateElement(`<p><strong>Direccion:</strong> ${s_locationDescription}</p>`, s_locationDescription)}
      ${validateElement(
      `<h2>Transportador: ${s_selectTransporter}</h2>`,
      s_selectTransporter
    )}
      ${validateElement(`<p><strong>Ciudad:</strong> ${s_city}</p>`, s_city)}
      ${validateElement(`<p><u><strong>Nota:</strong></u> <u><i>${s_draw}</p></i></u>`, s_draw)}
    </div>
  </div>

    <!--d -->
        <div class="destination">
        <div class="title">
          <h2>Destinatario</h2>
          <p><strong>Nit:</strong> ${t_nit}</p>
          </div>
          
          <div class="destinationFields">
          ${validateElement(`<h4>Empresa: ${t_title}</h4>`, t_title)}
          ${validateElement(`<p><strong>Telefono:</strong> ${t_phoneNumber}</p>`, t_phoneNumber)}
          ${validateElement(
      `<p><strong>Direccion:</strong> ${t_locationDescription}</p>`,
      t_locationDescription
    )}
    ${validateElement(`<p><strong>Ciudad:</strong> ${t_city}</p>`, t_city)}
          </div>
          </div>
  </section>
    `;
  }

  return HTML;
};

export default createPrintView;
