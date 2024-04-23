<script>
export default {
  name: "adminActionButton",
  data() {
    return {
      role: JSON.parse(localStorage.getItem("role")),
    };
  },
  methods: {
    checkRole() {
      let arr = [
        {name: "super_admin"},
        {name: "admin"},
      ];
      let checker = arr.filter((e) => e.name == this.role.name);
      let result = checker.length > 0 ? true : false;
      return result;
    },
  },
  mounted() {
    this.checkRole();
  },
};
</script>

<template>
  <slot v-if="checkRole()" />
</template>
