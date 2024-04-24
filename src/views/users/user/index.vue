<script setup>
/* eslint-disable */
import ClientDatatable from "@/components/datatables/DatatableClient.vue";
</script>

<script>
/* eslint-disable */
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";
import axios from "axios";
import { actressComputed, actressMethods } from "@/state/helpers.js";
import BasicInput from "../../../components/inputs/basic.vue";
import BaseCard from "../../../components/cards/base-card.vue";

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
          name: "nationality",
          label: "Nationality",
          sortable: true,
          filterable: true,
          class: "text-end",
          headerClass: "text-center",
        },
        {
          name: "birth_year",
          label: "Birth Year",
          sortable: true,
          filterable: true,
          class: "text-end",
          headerClass: "text-center",
        },
        {
          name: "biography",
          label: "Biography",
          sortable: true,
          filterable: true,
          class: "text-end",
          headerClass: "text-center",
        },
      ],
    }
  },
  computed: {
    ...actressComputed,
  },
  methods: {
    ...actressMethods,
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
  this.fetchActresses()
}
};
</script>

<template>
  <Layout>
    <PageHeader title="Actress List" pageTitle="Actress"/>
    <div class="row">
      <BaseCard>
        <template #cardBody>
          <PageHeader title="Actress List" />
    <div class="row">
      <BaseCard :tableCard="true" :noFooter="true">
        <template #cardButton>
          <button class="btn btn-primary" @click="clear">
            <i class="ri-add-circle-line align-bottom me-1"></i>Add Actress
          </button>
        </template>
        <template #cardBody>
          <ClientDatatable :column="columns" :dataTable="actresses" v-if="actresses.length">
          </ClientDatatable>
        </template>
      </BaseCard>
    </div>
        </template>
      </BaseCard>
    </div>
  </Layout>
</template>
