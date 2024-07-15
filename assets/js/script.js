let datos;
let myLineChart;

async function obtenerDatos() {
  try {
    const apiURL = "https://mindicador.cl/api/";
    const response = await fetch(apiURL);
    datos = await response.json();
    return datos;
  } catch (error) {
    return alert("error al obtener los datos");
  }
}
obtenerDatos();

const convertirMoneda = function () {
  try {
    const CLP = document.querySelector("#valor").value;
    const moneda = document.querySelector("#moneda").value;
    const resultado = document.querySelector("#resultado");
    if (CLP && moneda != "sin seleccion") {
      const CLPConvertido = CLP / datos[moneda].valor;
      const indicador = 1 * datos[moneda].valor;
      resultado.innerHTML = `
        <p>${CLP} CLP equivale a: <strong> ${CLPConvertido.toFixed(
        2
      )} </strong> ${moneda}</p>
        <p> El valor actual del ${moneda} es:  <strong> ${indicador} </strong> </p>       
        `;
    } else {
      return alert("Debe ingresar un valor");
    }
    renderGrafico(moneda);
  } catch {
    resultado.innerHTML = `
        <p><strong> No se puede transformar valor</strong></p>     
        `;
  }
  renderGrafico(moneda);
};

const moneda = document.querySelector("#moneda");

async function Grafico(moneda) {
  const responsive = await fetch(`https://mindicador.cl/api/${moneda}`);
  const valores = await responsive.json();
  const ultimosDias = valores.serie.slice(0, 10).reverse();

  const labels = ultimosDias.map((dia) => {
    return dia.fecha.split("T")[0];
  });
  const data = ultimosDias.map((dia) => {
    return dia.valor;
  });
  const datasets = [
    {
      label: `Valor del ${moneda} en los ultimos 10 dias`,
      borderColor: "rgb(241, 102, 223)",
      data,
    },
  ];
  return { labels, datasets };
}

async function renderGrafico(moneda) {
  const data = await Grafico(moneda);
  const config = { type: "line", data };
  const myChart = document.querySelector("#myChart");
  if (myLineChart) {
    myLineChart.destroy();
  }
  myLineChart = new Chart(myChart, config);
}
renderGrafico(moneda);
