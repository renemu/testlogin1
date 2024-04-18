import axios from "axios";
import Swal from "sweetalert2";

export const state = {
    actress: {},
    actresses: [],
  };
  export const getters = {
    actresses: (state) => state.actresses,
    actress: (state) => state.actress,
  };
  
  export const mutations = {
    setActresses(state, newValue) {
      state.actresses = newValue;
    },
    setActress(state, newValue) {
      state.actress = newValue;
    }
  };

  export const actions = {
    fetchActresses({ commit }) {
    axios.get("https://freetestapi.com/api/v1/actresses")
      .then((res) => {
        commit("setActresses", res.data);
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
