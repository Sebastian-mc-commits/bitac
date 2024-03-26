import { setLinkStyles } from "../navigation.js";

const printWindow = (
  HTML,
  onafterprint = () => null,
  windowSizeAtt = ["height=400", "width=900"]
) => {
  const printWindow = window.open("", "", windowSizeAtt.join(", "));

  printWindow.document.write(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Print</title>
  </head>
  <body>
    ${HTML}
  </body>
  </html>
  `);

  // printWindow.open(updateForm);
  // setStyles({
  //   getStyles: printStyles,
  //   element: printWindow.document.head
  // });

  setLinkStyles(import.meta.url, printWindow.document)
  //   printWindow.focus();

  printWindow.document.close();

  setTimeout(() => {
    printWindow.onafterprint = onafterprint;
    printWindow.print();
    printWindow.onafterprint = null;
    printWindow.close();
  }, 500);
};

export default printWindow;
