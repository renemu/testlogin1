<script setup>
/* eslint-disable */
import ClientDatatable from "@/components/datatables/DatatableClient.vue";
</script>

<script>
/* eslint-disable */
import Layout from "@/layouts/main.vue";
import { channelComputed, channelMethods } from "@/state/helpers.js";
import BasicInput from "@/components/inputs/basic.vue";
import ModalBasic from "@/components/modals/basic.vue";
import PageHeader from "@/components/page-header.vue";
import BaseCard from "@/components/cards/base-card.vue";
// import vSelect from "vue-select";
// import "vue-select/dist/vue-select.css";

export default {
  components: {
    Layout,
    BasicInput,
    PageHeader,
    ModalBasic,
    BaseCard,
    // vSelect,
  },
  data() {
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
          label: "ID",
          width: "5%",
          sortable: true,
          filterable: true,
        },
        {
          name: "display_name",
          label: "Name",
          sortable: true,
          filterable: true,
          class: "fw-bolder",
          custom: {
            icon: "orange ri-typhoon-line align-bottom me-1",
            routeName: "channel.detail",
            params: "id",
          },
        },
        {
          name: "url",
          label: "URL",
          class: "align-middle",
          sortable: true,
          filterable: true,
        },
        {
          name: "platform",
          label: "Platform",
          class: "align-middle",
          sortable: true,
          filterable: true,
        },
        {
          name: "alltime_sales",
          label: "Alltime Sales",
          class: "align-middle",
          sortable: true,
          filterable: true,
          isNumber: true,
        },
      ],
      options: {
        responsive: true,
        select: true,
        autoWidth: false,
        language: {
          search: "Search",
          zeroRecords: "No Data Found",
          info: "Showing _START_ of _END_ of _TOTAL_ entries",
          infoFiltered: "filtered _MAX_ records",
        },
        order: [[0, "asc"]],
      },
    };
  },
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
  },
  mounted() {
    this.fetchChannels();
    this.fetchParams();
  },
};
</script>
<template>
  <Layout>
    <PageHeader title="channel List" />
    <div class="row">
      <BaseCard :tableCard="true" :noFooter="true">
        <template #cardButton>
          <button class="btn btn-primary" @click="clear">
            <i class="ri-add-circle-line align-bottom me-1"></i>Add Channel
          </button>
        </template>
        <template #cardBody>
          <ClientDatatable :column="columns" :dataTable="channels">
          </ClientDatatable>
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
