import axios from "axios";
import Swal from "sweetalert2";

export const state = {
    elektronik: {},
    elektroniks: [],
  };
  export const getters = {
    elektroniks: (state) => state.elektroniks,
    elektronik: (state) => state.elektronik,
  };
  
  export const mutations = {
    setElektroniks(state, newValue) {
      state.elektroniks = newValue;
    },
    setElektronik(state, newValue) {
      state.elektronik = newValue;
    }
  };

  export const actions = {
    fetchElektroniks({ commit }) {
    axios.get("https://freetestapi.com/api/v1/products")
      .then((res) => {
        commit("setElektroniks", res.data);
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 404) {
            Swal.fire({
              icon: "error",
              title: "Not Found",
              text: "The requested resource was not found.",
            });
          } else if (error.response.status === 500) {
            Swal.fire({
              icon: "error",
              title: "Internal Server Error",
              text: "There was a problem with the server & Check Internet Connection!",
            });
          }
        } else if (error.request) {
          Swal.fire({
            icon: "error",
            title: "Network Error",
            text: "Unable to connect to the server.",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "An unexpected error occurred.",
          });
        }
      });
  },
}
