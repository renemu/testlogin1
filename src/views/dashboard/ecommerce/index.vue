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
import { elektronikComputed, elektronikMethods } from "@/state/helpers.js";
import BasicInput from "../../../components/inputs/basic.vue";
import BaseCard from "../../../components/cards/base-card.vue";
// import Swal from "sweetalert2";
// import AdminActionButton from "../../../components/buttons/adminActionButton.vue";

export default {
  components: {
    Layout,
    PageHeader,
    BaseCard,
    BasicInput
  },
  data(){
    return {
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
    ...elektronikComputed,
  },
  methods: {
    ...elektronikMethods,
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
  this.fetchElektroniks()
}
};

</script>

<style>
.textcenter{
  text-align: center;
  /* font-size: 15px; */
}
.centerline{
  align-content: center;
}
</style>

<template>
  <Layout>
    <PageHeader title="User List" pageTitle="User"/>
    <div class="row">
      <BaseCard>
        <template #cardBody>
          <PageHeader title="Product List" />
    <div class="row">
      <BaseCard :tableCard="true" :noFooter="true">
        <template #cardButton>
          <button class="btn btn-primary" @click="clear">
            <i class="ri-add-circle-line align-bottom me-1"></i>Add Products
          </button>
        </template>
        <template #cardBody>
          <ClientDatatable :column="columns" :dataTable="elektroniks" v-if="elektroniks.length">
          </ClientDatatable>
        </template>
      </BaseCard>
    </div>
        </template>
      </BaseCard>
    </div>
  </Layout>
</template>
