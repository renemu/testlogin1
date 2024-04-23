/* eslint-disable */
import Swal from "sweetalert2";
import apiClient from "../../../service/apiClientService";
import axios from "axios";

export const state = {
  channel: {},
  channels: [],
  params: {},
};

export const getters = {
  channels: (state) => state.channels,
  channel: (state) => state.channel,
  params: (state) => state.params,
};

export const mutations = {
  setChannels(state, newValue) {
    state.channels = newValue;
  },
  setChannel(state, newValue) {
    state.channel = newValue;
  },
  setParams(state, newValue) {
    let platformArray = [];
    let groupArray = [];
    newValue.platform.map((item) => {
      let isi = {
        value: item.platform,
        label: item.platform,
      };
      platformArray.push(isi);
    });
    newValue.group.map((item) => {
      let isi = {
        value: item.id,
        label: item.display_name,
      };
      groupArray.push(isi);
    });
    let object = {
      platform: platformArray,
      group: groupArray,
    };
    state.params = object;
  },
  deleteChannel(state, channelId) {
    const channel = state.channels.find((channel) => {
      return channel.id == channelId;
    });
    state.channels.splice(state.channels.indexOf(channel), 1);
  },
  createChannel(state, newValue) {
    state.channels.push(newValue);
  },
  updateChannel(state, loader) {
    Object.keys(loader.value).forEach(function (key) {
      state.channel[key] = loader.value[key];
    });
  },
};

export const actions = {
  fetchChannels({ commit }) {
    apiClient.get("https://dev-backend-arjuna.gawebecik.id/api/marketings/channel/channels")
      .then((res) => {
        commit("setChannels", res.data);
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
  // fetchParams({ commit }) {
  //   apiClient.get("https://dev-backend-arjuna.gawebecik.id/api/marketings/channel/channels/create").then((res) => {
  //     commit("setParams", res.data);
  //   });
  // },
  setDataChannel({ commit }, channelId) {
    apiClient.get(`https://dev-backend-arjuna.gawebecik.id/api/marketings/channel/channels/${channelId}`)
      .then((res) => {
        commit("setChannel", res.data);
        commit("setPositions", res.data.positions);
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
  deleteChannel({ commit }, channelId) {
    Swal.fire({
      title: "Delete Data",
      text: "Are you sure you want to delete this data?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        apiClient.delete(`https://dev-backend-arjuna.gawebecik.id/api/marketings/channel/channels/${channelId}`)
          .then((response) => {
            Swal.fire({
              title: "Deleted!",
              text: "The data has been deleted successfully.",
              icon: "success",
            });

            commit("deleteChannel", channelId);
          })
          .catch((error) => {
            if (error.response && error.response.status === 406) {
              const errorMessage = error.response.data.message;

              Swal.fire({
                title: "Error",
                text: errorMessage,
                icon: "error",
              });
            } else {
              Swal.fire({
                title: "Error",
                text: "An error occurred while deleting the data.",
                icon: "error",
              });
            }
          });
      }
    });
  },
  createChannel({ commit }, payload) {
    apiClient.post("https://dev-backend-arjuna.gawebecik.id/api/marketings/channel/channels", payload)
      .then((res) => {
        Swal.fire({
          title: "Success",
          text: "The data has been created successfully.",
          icon: "success",
        });
        commit("createChannel", res.data);
      })
      .catch((error) => {
        if (error.response && error.response.status === 406) {
          const errorMessage = error.response.data.message;

          Swal.fire({
            title: "Error",
            text: errorMessage,
            icon: "error",
          });
        } else {
          Swal.fire({
            title: "Error",
            text: "An error occurred while creating the data.",
            icon: "error",
          });
        }
      });
  },
  updateChannel({ commit }, payload) {
    apiClient.put(`https://dev-backend-arjuna.gawebecik.id/api/marketings/channel/channels/${payload.id}`, payload.data)
      .then((res) => {
        Swal.fire({
          title: "Success",
          text: "The data has been updated successfully.",
          icon: "success",
        });
        const loader = {
          value: res.data,
          id: payload.id,
        };
        commit("updateChannel", loader);
      })
      .catch((error) => {
        if (error.response && error.response.status === 406) {
          const errorMessage = error.response.data.message;

          Swal.fire({
            title: "Error",
            text: errorMessage,
            icon: "error",
          });
        } else {
          Swal.fire({
            title: "Error",
            text: "An error occurred while updating the data.",
            icon: "error",
          });
        }
      });
  },
};
