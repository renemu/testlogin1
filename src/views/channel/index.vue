<script setup>
/* eslint-disable */
import ClientDatatable from "@/components/datatables/DatatableClient.vue";
</script>

<script>
/* eslint-disable */
// import Vue from 'vue';
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";
import axios from "axios";
import { channelComputed, channelMethods } from "@/state/helpers.js";
import BasicInput from "../../components/inputs/basic.vue";
import BaseCard from "../../components/cards/base-card.vue";
// import Swal from "sweetalert2";
import ModalBasic from "../../components/modals/basic.vue";
// import AdminActionButton from "../../../components/buttons/adminActionButton.vue";

export default {
  components: {
    Layout,
    PageHeader,
    BaseCard,
    BasicInput,
    // ModalBasic,
  },
  data(){
    return {
      checked: false,
      formData: {},
      modalAdd: false,
      inputFields: [
        {
          id: 1,
          label: "Name",
          name: "display_name",
          inputType: "text",
          modelValue: "",
          placeholder: "Channel Name",
          required: true,
        },
        {
          id: 2,
          label: "URL",
          name: "url",
          inputType: "url",
          modelValue: "",
          placeholder: "Channel Url",
          required: false,
        },
      ],
      columns: [
        {
          name: "id",
          label: "No",
          width: "7%",
          sortable: true,
          filterable: true,
        },
        {
          name: "name",
          label: "Name",
          sortable: true,
          filterable: true,
        },
        {
          name: "brand",
          label: "Brand",
          sortable: true,
          filterable: true,
          class: "text-end",
          headerClass: "text-center",
        },
        {
          name: "connectivity",
          label: "Connectivity",
          sortable: true,
          filterable: true,
          class: "text-end",
          headerClass: "text-center",
        },
        {
          name: "description",
          label: "Description",
          sortable: true,
          filterable: true,
          class: "text-end",
          headerClass: "text-center",
        },
      ],
    }
  },
  // methods: {
  //   fetchData() {
  //     axios
  //       .get("https://cat-fact.herokuapp.com/facts")
  //       .then((response) => {
  //         console.log("Data berhasil", response.data.data);
  //       })
  //       .catch((error) => console.log(error));
  //   },
  // },
  computed: {
    ...channelComputed,
  },
  methods: {
    ...channelMethods,
    createData() {
      this.createChannel(this.formData);
      this.modalAdd = !this.modalAdd;
      this.checked = false;
    },
    clear() {
      this.modalAdd = !this.modalAdd;
      this.checked = false;
      this.formData = {};
    },
  },
  created() {
    const roles = JSON.parse(localStorage.getItem("roles"));
    const profile = JSON.parse(localStorage.getItem("profile"));

    if (roles && roles.length > 0) {
      this.display_name = roles[0].display_name;
    }
    if (profile) {
      this.name = profile.name;
    }
  // this.fetchElektroniks()
    // this.fetchData();
},
mounted(){
  this.fetchChannels()
  this.fetchParams()

},
};

</script>

<template>
  <Layout>
    <PageHeader title="Channel List" pageTitle="Channel"/>
    <div class="row">
      <BaseCard>
        <template #cardBody>
          <PageHeader title="Channel List" />
      <div class="row">
      <BaseCard :tableCard="true" :noFooter="true">
        <template #cardButton>
          <button class="btn btn-primary" @click="clear">
            <i class="ri-add-circle-line align-bottom me-1"></i>Add Channel
          </button>
        </template>
        <template #cardBody>
          <ClientDatatable :column="columns" :dataTable="channels" v-if="channels.length">
          </ClientDatatable>
        </template>
      </BaseCard>
    </div>
        </template>
      </BaseCard>
    </div>
    <ModalBasic title="Add Channel" v-model="modalAdd">
      <template #body>
        <form id="addChannel" @submit.prevent="createData">
          <div v-for="input in inputFields" :key="input.id">
            <BasicInput
              v-model="formData[input.name]"
              :name="input.name"
              :label="input.label"
              :type="input.inputType"
              :placeholder="input.placeholder"
              :required="input.required"
            />
          </div>
          <div class="mt-1">
            <label for="platform">Platform</label>
            <vSelect
              id="platform"
              name="platform"
              v-model="formData.platform"
              :options="params.platform"
              :reduce="(data) => data.value"
              placeholder="Select platform"
            >
              <template #search="{ attributes, events }">
                <input
                  class="vs__search"
                  :required="!formData.platform"
                  v-bind="attributes"
                  v-on="events"
                />
              </template>
            </vSelect>
          </div>
         
        </form>
      </template>
      <template #footer>
        <div class="row">
          <div class="col col-lg-5 mt-4">
            <input
              v-model="checked"
              type="checkbox"
              id="checkboxEditProfile"
              style="margin-right: 4px"
            />
            <label for="checkboxEditProfile">Confirm</label>
          </div>
          <div class="col col-lg-7 hstack gap-2 justify-content-end">
            <div>
              <button
                class="btn btn-light"
                style="margin-right: 1em"
                type="button"
                @click="modalAdd = !modalAdd"
              >
                Close
              </button>
              <button
                class="btn btn-primary"
                form="addChannel"
                type="submit"
                :class="!checked ? 'disabled' : ''"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </template>
    </ModalBasic>
  </Layout>
</template>
