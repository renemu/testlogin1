<script>
export default {
  name: "ModalBasic",
  props: ["title", "isVisible"],
};
</script>
<template>
  <BModal
    :value="isVisible"
    hide-footer
    :title="title"
    class="v-modal-custom"
  >
    <div>
      <slot name="body" />
    </div>
    <div style="margin-top: 20px">
      <slot name="footer" />
    </div>
  </BModal>
</template>
