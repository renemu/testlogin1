<template>
  <nav class="">
    <div class="row">
      <div class="col-sm-12 col-md-5">
        <span class="page-stats"
          >Showing {{ pagination.from }} to {{ pagination.to }} of
          {{ pagination.total }} entries</span
        >
      </div>
      <div class="col-sm-12 col-md-7 d-flex justify-content-end">
        <div class="dataTables_paginate paging_full_numbers">
          <BButton-group
            role="group"
            aria-label="Basic example"
            size="sm"
            v-for="(link, index) in pagination.links"
            :key="index"
          >
            <BButton
              v-if="index === 0"
              v-html="link.label"
              :disabled="disableButton(1)"
              variant="light"
              @click="redirect(link.url)"
            ></BButton>
            <BButton
              v-if="index === pagination.links.length - 1"
              v-html="link.label"
              :disabled="disableButton(pagination.lastPage)"
              variant="light"
              @click="redirect(link.url)"
            ></BButton>
            <BButton
              v-if="link.active === true"
              variant="primary"
              class="paginate_button page-item active"
              @click="redirect(link.url)"
              >{{ link.label }}</BButton
            >
            <BButton
              v-else-if="link.label === '...'"
              v-html="link.label"
              disabled
              variant="light"
            ></BButton>
            <BButton
              v-else-if="index !== 0 && index !== pagination.links.length - 1"
              variant="light"
              @click="redirect(link.url)"
              >{{ link.label }}
            </BButton>
          </BButton-group>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  props: ["pagination"],
  methods: {
    changer(data) {
      let newUrl = data.replace("http://", "https://");
      return newUrl;
    },
    redirect(url) {
      let URL = this.changer(url);
      this.$emit("link", URL);
    },
    disableButton(this_page) {
      if (this.$props.pagination.currentPage === this_page) {
        return true;
      }
      return false;
    },
  },
};
</script>

<style>
.active {
  color: #405189;
}
</style>
