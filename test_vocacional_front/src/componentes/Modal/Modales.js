import Swal from "sweetalert2";

export const ModalError = (titulo="Error", texto="Error desconocido", footer=false, onClick=()=>{return}) => {    
    Swal.fire({
        icon: "error",
        title: titulo,
        text: texto,
        footer: `${footer ? '<a href="/registrar">Si no has creado una cuenta da click aquí</a>' : ''}`,
        target: "#main",
        customClass: {

        }
    }).then((result) => {
      if (result.isConfirmed) {
        // Ejecutas la función que pasaste como parámetro
        onClick();
      }
    });
}

export const ModalExito = (titulo="Todo bien", texto='', onClick=()=>{return}) => {
    Swal.fire({
      icon: "success",
      title: titulo,
      text: texto,
      target: "#main"
    }).then((result) => {
      if (result.isConfirmed) {
        // Ejecutas la función que pasaste como parámetro
        onClick();
      }
    });;
  };

  export const ModalWarning = (titulo="Advertencia", texto='', onClick=()=>{return}) => {
    Swal.fire({
      icon: "warning",
      title: titulo,
      text: texto,
      target: "#main"
    }).then((result) => {
      if (result.isConfirmed) {
        // Ejecutas la función que pasaste como parámetro
        onClick();
      }
    });;
  };