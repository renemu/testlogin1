import Swal from "sweetalert2";
import apiClient from "../../../service/apiClientService";

export const state = {
  product: {},
  detail: {},
  products: [],
  groups: [],
  pricings: [],
  units: [],
};

export const getters = {
  products: (state) => state.products,
  product: (state) => state.product,
  groups: (state) => state.groups,
  pricings: (state) => state.pricings,
  units: (state) => state.units,
};

export const mutations = {
  setProducts(state, newValue) {
    state.products = newValue;
  },
  setProduct(state, newValue) {
    state.product = newValue;
  },
  setDetailProducts(state, newValue) {
    state.detail = newValue;
  },
  setProductGroup(state, newValue) {
    state.groups = newValue;
  },
  setProductUnit(state, newValue) {
    state.units = newValue;
  },
  setProductPricing(state, newValue) {
    state.pricings = newValue;
  },

  deleteProduct(state, productId) {
    // state.products = newValue
    const product = state.products.find((product) => {
      return product.id == productId;
    });
    state.products.splice(state.products.indexOf(product), 1);
  },
  createProduct(state, newValue) {
    state.products.push(newValue);
  },
  updateProduct(state, loader) {
    Object.keys(loader.value).forEach(function (key) {
      state.product[key] = loader.value[key];
    });
  },
};

export const actions = {
  fetchProducts({ commit }) {
    apiClient
      .get("https://dev-backend-arjuna.gawebecik.id/api/marketings/channel/channels")
      .then((res) => {
        commit("setProducts", res.data);
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
        // console.error('apiClient Error', error);
      });
  },
  fetchGroupsVariables({ commit }) {
    apiClient.get("/product/products/create").then((res) => {
      commit("setProductGroup", res.data.groups);
    });
    apiClient.get("/product/products/create").then((res) => {
      commit("setProductUnit", res.data.units);
    });
    apiClient.get("/product/products/create").then((res) => {
      commit("setProductPricing", res.data.pricings);
    });
  },
  setDataProduct({ commit }, productId) {
    apiClient
      .get(`/product/products/${productId}`)
      .then((res) => {
        commit("setProduct", res.data);
      })
      .catch((error) => {
        if (error.response && error.response.status === 406) {
          const errorMessage = error.response.data.message;

          Swal.fire({
            title: "Error",
            text: errorMessage,
            icon: "error",
          });
        } else if (error.response.status === 404) {
          Swal.fire({
            title: "Error",
            text: error.response.data.message,
            icon: "error",
          });
        } else {
          Swal.fire({
            title: "Error",
            text: "An error occurred while fetching the data.",
            icon: "error",
          });
        }
      });
  },
  detailProduct({ commit }, payload) {
    apiClient.get(`/products/product/${payload.id}`).then((res) => {
      commit("setDetailProducts", res.data);
    });
  },
  deleteProduct({ commit }, productId) {
    Swal.fire({
      title: "Delete Product",
      text: "Are you sure you want to delete this product?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        apiClient
          .delete(`/products/product/${productId}`)
          .then((response) => {
            console.log("Data successfully deleted:", response.data);

            Swal.fire({
              title: "Deleted!",
              text: "The product has been deleted successfully.",
              icon: "success",
            });

            commit("deleteProduct", productId);
          })
          .catch((error) => {
            console.error("Error deleting data:", error);
            Swal.fire({
              title: "Error",
              text: "An error occurred while deleting the product.",
              icon: "error",
            });
          });
      }
    });
  },
  createProduct({ commit }, payload) {
    apiClient
      .post("/product/products", payload)
      .then((res) => {
        // console.log("product created successfully", res.data);
        Swal.fire({
          title: "Success",
          text: "The product has been created successfully.",
          icon: "success",
        });
        commit("createProduct", res.data);
      })
      .catch((error) => {
        console.error("Error creating product", error);

        Swal.fire({
          title: "Error",
          text: "An error occurred while creating the product.",
          icon: "error",
        });
      });
  },
  updateProduct({ commit }, payload) {
    apiClient
      .put(`/product/products/${payload.id}`, payload.data)
      .then((res) => {
        console.log("Data updated successfully", res.data);
        Swal.fire({
          title: "Success",
          text: "The product has been updated successfully.",
          icon: "success",
        });
        const loader = {
          value: res.data,
          id: payload.id,
        };
        // console.log(loader)
        commit("updateProduct", loader);
      })
      .catch((error) => {
        console.error("Error creating product", error);

        Swal.fire({
          title: "Error",
          text: "An error occurred while updating the product.",
          icon: "error",
        });
      });
  },
};
