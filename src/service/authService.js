import router from "../router/index";
import apiClient from "./apiClientService";
import Swal from "sweetalert2";

const logout = async () => {
  apiClient
    .post("/auth/logout")
    .then(() => {
      localStorage.clear();
      router.push({name: 'auth.logout'});
    })
    .catch((error) => {
      if (error.response.status === 401 && localStorage.getItem("token")) {
        Swal.fire(
          "Error",
          "Akun anda sudah masuk di perangkat lain, ingin login di perangkat ini?",
          "error"
        ).then((stat) => {
          if (stat.isConfirmed) {
            localStorage.clear();
            router.push({
              name: "auth.login",
            });
          }
        });
      } else {
        Swal.fire('Error', error.response?.data?.message, 'error');
      }
    });
};

export { logout };
