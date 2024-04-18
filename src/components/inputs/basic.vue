<script>

export default {
  name: "BasicInput",
  props: ["label", "type", "name", "modelValue", "placeholder"],
};
</script>
<template>
  <div>
    <label :for="name" class="mt-2 mb-2" v-if="label">{{ label }}</label>
    <input
      class="form-control"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      @input="$emit('update:modelValue', $event.target.value)"
      v-bind="$attrs"
    />
  </div>
</template>
