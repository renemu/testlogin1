<template>
  <div class="dataTables_wrapper dt-bootstrap5 no-footer">
    <div class="row">
      <div class="col-sm-12 col-md-6">
        <div class="dataTables_length" v-if="table_show">
          <label>
            Show
            <select
              v-model="pageSize"
              id="pageSize"
              aria-controls="datatable"
              class="form-select form-select-sm"
            >
              <option
                v-for="(option, index) in pageSizeOptions"
                :value="option"
                :key="index"
              >
                {{ option }}
              </option>
            </select>
            entries
          </label>
        </div>
      </div>
      <div class="col-sm-12 col-md-6">
        <div class="dataTables_filter" v-if="table_search">
          <label for="filter"
            >Search:
            <input
              type="search"
              v-model="filter"
              id="filter"
              class="form-control form-control-sm"
              placeholder=""
              aria-controls="datatable"
            />
          </label>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12">
        <table
          id="datatable"
          class="table table-bordered table-striped align-middle text-nowrap dt-responsive nowrap dataTable no-footer"
          :class="table_class"
          style="width: 100%"
          aria-describedby="datatable_info"
        >
          <thead class="align-middle">
            <tr>
              <th
                v-for="(column, index) in columns"
                :key="index"
                @click="toggleSorting(column)"
                :style="
                  'width:' +
                  column.width +
                  '; cursor:' +
                  (column.sortable ? ' pointer;' : ' default;')
                "
                :class="checkIcon(column) + ' ' + column.headerClass"
                aria-controls="datatable"
              >
                {{ column.label }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in paginatedItems" :key="index">
              <td v-for="(column, columnIndex) in columns" :key="columnIndex">
                <div v-if="column.isNumber" :class="column.class">
                  <span style="float: left" v-if="column.currency">{{
                    column.currency
                  }}</span>
                  {{
                    item[column.name] ? formatCurrency(item[column.name]) : 0
                  }}
                </div>
                <div v-else-if="column.custom">
                  <div
                    v-if="column.custom.routeName"
                    :class="
                      (column.bold ? 'fw-bold ' : 'fw-normal ') + column.class
                    "
                  >
                    <span>
                      <i
                        v-if="column.custom.icon"
                        :class="column.custom.icon"
                      ></i>
                      <img
                        v-if="column.custom.image"
                        :src="avatar(item[column.custom.image])"
                        class="rounded-circle avatar-xxs me-2"
                      />
                      <router-link
                        :to="{
                          name: column.custom.routeName,
                          params: { id: item[column.custom.params] },
                        }"
                      >
                        {{ item[column.name] }}
                      </router-link>
                    </span>
                  </div>
                  <div v-else :class="column.class">
                    <span>
                      <i :class="column.custom.icon"></i>
                      {{ item[column.name] }}
                    </span>
                  </div>
                </div>
                <div v-else-if="column.badge">
                  <div v-if="column.badge.isArray">
                    <div
                      v-for="(array, indexA) in project[column.name]"
                      :key="indexA"
                    >
                      <div
                        v-for="model in column.badge.types"
                        :key="model.value"
                      >
                        <span
                          class="badge bg-success-subtle text-success p-2"
                        ></span>
                        <span
                          class="badge text-light"
                          :style="'background-color: ' + array.color + ';'"
                          >{{ array.display_name }}</span
                        >
                      </div>
                    </div>
                  </div>
                  <div v-else>
                    <div v-for="model in column.badge.types" :key="model.value">
                      <span
                        class="badge text-light"
                        :style="'background-color: ' + array.color + ';'"
                        >{{ array.display_name }}</span
                      >
                    </div>
                  </div>
                </div>
                <div v-else>
                  {{ item[column.name] }}
                </div>
              </td>
            </tr>
            <tr v-if="paginatedItems.length == 0">
              <td
                :colspan="columns.length"
                class="dataTables_empty"
                valign="top"
              >
                No data available in table
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12 col-md-5" v-if="table_pagination">
        <div
          class="dataTables_info"
          id="datatable_info"
          role="status"
          aria-live="polite"
        >
          <span class="page-stats">Showing {{ entriesRange }} entries</span>
        </div>
      </div>
      <div
        class="col-sm-12 col-md-7 d-flex justify-content-end"
        v-if="table_pagination"
      >
        <div
          :class="
            totalPages >= 10 ? 'paging_simple_numbers' : 'paging_full_numbers'
          "
          class="dataTables_paginate"
          id="datatable_paginate"
        >
          <ul class="pagination">
            <li class="paginate_button page-item previous">
              <button
                @click="prevPage"
                class="page-link"
                data-dt-idx="0"
                tabindex="0"
                :style="
                  'cursor:' + (currentPage === 1 ? ' default;' : ' pointer;')
                "
              >
                Previous
              </button>
            </li>
            <template v-if="totalPages <= 10">
              <li
                class="paginate_button page-item"
                v-for="pageNumber in pages"
                :key="pageNumber"
              >
                <button
                  @click="goToPage(pageNumber)"
                  class="page-link"
                  data-dt-idx="2"
                  tabindex="0"
                  :class="{ active: pageNumber === currentPage }"
                  :style="
                    'cursor:' +
                    (pageNumber === currentPage ? ' default;' : ' pointer;')
                  "
                >
                  {{ pageNumber }}
                </button>
              </li>
            </template>
            <template v-else>
              <li
                v-if="ellipsisPages.start > 1"
                class="paginate_button page-item"
              >
                <button
                  @click="goToPage(1)"
                  class="page-link"
                  data-dt-idx="2"
                  tabindex="0"
                  :class="{ active: 1 === currentPage }"
                  :style="
                    'cursor:' + (1 === currentPage ? ' default;' : ' pointer;')
                  "
                >
                  1
                </button>
              </li>
              <li v-if="ellipsisPages.start > 1">
                <span class="page-link">...</span>
              </li>
              <li
                class="paginate_button page-item"
                v-for="pageNumber in ellipsisPages.range"
                :key="pageNumber"
              >
                <button
                  @click="goToPage(pageNumber)"
                  class="page-link"
                  data-dt-idx="2"
                  tabindex="0"
                  :class="{ active: pageNumber === currentPage }"
                  :style="
                    'cursor:' +
                    (pageNumber === currentPage ? ' default;' : ' pointer;')
                  "
                >
                  {{ pageNumber }}
                </button>
              </li>
              <li v-if="ellipsisPages.end < totalPages">
                <span class="page-link" style="pointer-events: none">...</span>
              </li>
              <li
                v-if="ellipsisPages.end < totalPages"
                class="paginate_button page-item"
              >
                <button
                  @click="goToPage(totalPages)"
                  class="page-link"
                  data-dt-idx="2"
                  tabindex="0"
                  :class="{ active: totalPages === currentPage }"
                  :style="
                    'cursor:' +
                    (totalPages === currentPage ? ' default;' : ' pointer;')
                  "
                >
                  {{ totalPages }}
                </button>
              </li>
            </template>
            <li class="paginate_button page-item next">
              <button
                @click="nextPage"
                class="page-link"
                data-dt-idx="8"
                tabindex="0"
                :style="
                  'cursor:' +
                  (currentPage === totalPages ? ' default;' : ' pointer;')
                "
              >
                Next
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.active {
  font-weight: bold;
}

.material-icons {
  vertical-align: middle;
}
</style>

<script>
import { getAvatar } from "../../utils/assetsHelper";

export default {
  name: "ClientDatatable",
  props: {
    table_search: {
      type: Boolean,
      default: true,
    },
    table_show: {
      type: Boolean,
      default: true,
    },
    table_class: {
      type: String,
      default: "",
    },
    table_pagination: {
      type: Boolean,
      default: true,
    },
    sortBy: {
      type: String,
      default: "",
    },
    order: {
      type: Number,
      default: 1,
    },
    dataTable: {
      type: Array,
      default: () => [],
    },
    column: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      items: this.$props.dataTable,
      columns: this.$props.column,
      filter: "",
      sortKey: this.$props.sortBy,
      sortOrders: this.$props.order,
      pageSize: 10,
      currentPage: 1,
      pageSizeOptions: [10, 25, 50, 100],
      spinner: true,
    };
  },
  computed: {
    filteredItems() {
      return this.$props.dataTable.filter((item) => {
        return Object.keys(item).some(
          (name) =>
            this.isColumnFilterable(name) &&
            String(item[name]).toLowerCase().includes(this.filter.toLowerCase())
        );
      });
    },
    sortedItems() {
      const filterData = this.filteredItems;
      return filterData.sort((a, b) => {
        return a[this.sortKey] > b[this.sortKey]
          ? this.sortOrders
          : -this.sortOrders;
      });
    },
    totalPages() {
      return Math.ceil(this.sortedItems.length / this.pageSize);
    },
    paginatedItems() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.sortedItems.slice(start, end);
    },
    pages() {
      const pagesArray = [];
      for (let i = 1; i <= this.totalPages; i++) {
        pagesArray.push(i);
      }
      return pagesArray;
    },
    entriesRange() {
      const start = (this.currentPage - 1) * this.pageSize + 1;
      const end = Math.min(
        this.currentPage * this.pageSize,
        this.filteredItems.length
      );
      return `${start} to ${end} of ${this.filteredItems.length}`;
    },
    ellipsisPages() {
      const visiblePages = 5; // Number of visible pages including ellipsis
      let start = this.currentPage - Math.floor(visiblePages / 2);
      start = Math.max(start, 1);
      let end = start + visiblePages - 1;
      if (end > this.totalPages) {
        end = this.totalPages;
        start = Math.max(end - visiblePages + 1, 1);
      }
      return {
        start,
        end,
        range: Array.from({ length: end - start + 1 }, (_, i) => start + i),
      };
    },
  },
  methods: {
    avatar: (avatar) => getAvatar(avatar),
    toggleSorting(column) {
      if (column.sortable) {
        this.sortKey = column.name;
        // column.sortOrder *= -1;
        this.sortOrders *= -1;
      }
    },
    isColumnFilterable(key) {
      const column = this.columns.find((column) => column.name === key);
      return column ? column.filterable : false;
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    goToPage(pageNumber) {
      this.currentPage = pageNumber;
    },
    checkIcon(column) {
      if (column.sortable) {
        if (this.sortKey === column.name) {
          if (this.sortOrders === 1) {
            return "sorting sorting_asc";
          } else {
            return "sorting sorting_desc";
          }
        } else {
          return "sorting";
        }
      } else {
        return "";
      }
    },
    formatCurrency(num) {
      var str = num.toString().replace("$", ""),
        parts = false,
        output = [],
        i = 1,
        formatted = null;
      if (str.indexOf(",") > 0) {
        parts = str.split(",");
        str = parts[0];
      }
      str = str.split("").reverse();
      for (var j = 0, len = str.length; j < len; j++) {
        if (str[j] != ".") {
          output.push(str[j]);
          if (i % 3 == 0 && j < len - 1) {
            output.push(".");
          }
          i++;
        }
      }
      formatted = output.reverse().join("");
      return formatted + (parts ? "," + parts[1].substr(0, 2) : "");
    },
  },
};
</script>
