<template>
  <div class="table-responsive">
    <div class="table align-middle mb-0">
      <table
        id="datatable"
        class="table table-bordered dt-responsive nowrap table-striped align-middle dataTable no-footer dtr-inline"
        style="width: 100%"
      >
        <thead class="table-light">
          <tr align="center">
            <th
              v-for="column in columns"
              :key="column.name"
              @click="$emit('sort', column.name)"
              :style="'width:' + column.width + ';' + 'cursor:pointer;'"
              :class="column.name === 'name' ? 'text-start' : 'text-center'"
            >
              {{ column.label }}
              <span v-html="check(column.name) || arrowIcon"></span>
            </th>
          </tr>
        </thead>
        <slot></slot>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  props: ["columns", "arrows"],

  computed: {
    arrowIcon() {
      return this.tableData === "desc"
        ? '<i class="ri-arrow-down-s-line"></i>'
        : '<i class="ri-arrow-up-s-line"></i>';
    },
  },

  methods: {
    check(colName) {
      if (this.arrows.col === colName) {
        return this.arrows.arr;
      }
      return "";
    },
  },
};
</script>
