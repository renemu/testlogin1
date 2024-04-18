<script>
export default {
  name: "BaseCard",
  props: {
    title: {
      type: [String],
      default: "",
    },
    cardClass: {
      type: String,
      default: "col-lg-12",
    },
    bodyClass: {
      type: String,
      default: "card-body",
    },
    headerClass: {
      type: String,
      default: "card-header d-flex align-items-center",
    },
    titleClass: {
      type: String,
      default: "flex-grow-1 mb-0 text-muted text-uppercase",
    },
    tableCard: {
      type: Boolean,
      default: false,
    },
    noFooter: {
      type: Boolean,
      default: false,
    },
    noHeader: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
<template>
  <div :class="cardClass">
    <div class="card">
      <slot name="progressBar"></slot>
      <div :class="headerClass" v-if="!noHeader">
        <slot name="cardHeader"></slot>
        <h5 v-if="title" :class="titleClass">
          <slot name="titleIcon"></slot>{{ title }}
        </h5>
        <div class="flex-shrink-0">
          <slot name="cardButton"></slot>
        </div>
      </div>
      <slot name="customHeader"></slot>
      <div :class="tableCard ? 'card-body table-responsive' : bodyClass">
        <slot name="cardBody"></slot>
      </div>
      <slot name="customFooter"></slot>
      <div class="card-footer" v-if="!noFooter">
        <div class="hstack gap-2 justify-content-start">
          <slot name="cardFooterStart"></slot>
        </div>
        <div class="hstack gap-2 justify-content-end">
          <slot name="cardFooterEnd"></slot>
        </div>
      </div>
    </div>
  </div>
</template>
<style></style>
