<script>
import apiClient from "../../service/ApiClientService";
import Datatable from "./Datatable.vue";
import Pagination from "./Pagination.vue";
import _debounce from "lodash/debounce";
import Swal from "sweetalert2";

export default {
  props: {
    edit: {
      type: Function,
    },
    url: {
      type: String,
      default: "",
    },
    search_column: {
      type: String,
      default: "name",
    },
    column: {
      type: Array,
    },
    data: {
      type: Object,
      default: () => {},
    },
  },
  components: { datatable: Datatable, pagination: Pagination },
  created() {
    this.getProjects();
  },
  data() {
    return {
      projects: [],
      columns: this.$props.column,
      sortStatus: "",
      perPage: ["10", "25", "50", "100"],
      arrows: {
        arr: "",
        col: "",
      },
      tableData: {
        per_page: 10,
        search: "",
        search_column: this.$props.search_column,
        short: "desc",
        orderBy: "",
      },
      pagination: {
        lastPage: "",
        currentPage: "",
        total: "",
        lastPageUrl: "",
        nextPageUrl: "",
        prevPageUrl: "",
        from: "",
        to: "",
        links: [],
      },
    };
  },
  methods: {
    getProjects(url = this.$props.url) {
      apiClient
        .get(url, { params: this.tableData })
        .then((response) => {
          let data = response.data;
          this.projects = data;
          this.configPagination(response.meta, response.links);
        })
        .catch((e) => {
          if (e.response) {
            Swal.fire("Error", e.response.data.message, "error");
          }
        });
    },
    getData(id) {
      this.$props.edit(id);
    },

    configPagination(meta, links) {
      this.pagination.lastPage = meta.last_page;
      this.pagination.currentPage = meta.current_page;
      this.pagination.from = meta.from;
      this.pagination.to = meta.to;
      this.pagination.total = meta.total;
      this.pagination.links = meta.links;
      this.pagination.lastPageUrl = this.changer(links.last);
      this.pagination.nextPageUrl = links.next
        ? this.changer(links.next)
        : null;
      this.pagination.prevPageUrl = links.prev
        ? this.changer(links.prev)
        : null;
    },
    changer(data) {
      let newUrl = data.replace("http://", "https://");
      return newUrl;
    },
    searching: _debounce(function (e) {
      this.tableData.search = e.target.value;
      this.getProjects();
    }, 500),
    sortBy(key) {
      this.tableData.orderBy = key;
      this.tableData.short = this.tableData.short === "desc" ? "asc" : "desc";
      this.arrows.arr =
        this.tableData.short === "desc"
          ? '<i class="mdi mdi-18px mdi-arrow-down-thin"></i>'
          : '<i class="mdi mdi-18px mdi-arrow-up-thin"></i>';
      this.arrows.col = key;
      this.getProjects();
    },
  },
};
</script>

<template>
  <div class="tableFilters">
    <div class="row">
      <div class="col-sm-12 col-md-6">
        <div class="datatables_length">
          <label
            >Show
            <select
              v-model="tableData.per_page"
              @change="getProjects()"
              class="col-sm-2 form-select w-auto form-select-sm"
            >
              <option
                v-for="(records, index) in perPage"
                :key="index"
                :value="records"
              >
                {{ records }}
              </option>
            </select>
            entries
          </label>
        </div>
      </div>

      <div class="col-sm-12 col-md-6">
        <div class="datatables_filter">
          <label
            >Search:<input
              type="text"
              v-model="tableData.search"
              class="form-control form-control-sm"
              placeholder="Search Table"
              @input="searching"
              aria-controls="datatable"
          /></label>
        </div>
      </div>
    </div>
    <div class="row">
      <datatable :columns="columns" @sort="sortBy" :arrows="arrows">
        <tbody>
          <tr v-for="(project, indexP) in projects" :key="indexP">
            <td
              v-for="(column, indexC) in columns"
              :key="indexC"
              align="center"
            >
              <div v-if="column.custom">
                <div v-if="column.isArray">
                  <div
                    v-for="(array, indexA) in project[column.name]"
                    :key="indexA"
                  >
                    <span><i :class="column.custom.icon"></i> </span>
                    <router-link
                      :to="{
                        name: column.custom.routeName,
                        params: { id: array.id },
                      }"
                      ><strong>{{ array.display_name }}</strong></router-link
                    >
                  </div>
                </div>
                <div v-else>
                  <span
                    ><i :class="column.custom.icon"></i>
                    {{ project[column.name] }}</span
                  >
                </div>
              </div>
              <div v-else-if="column.badge">
                <div v-if="column.isArray">
                  <div
                    v-for="(array, indexA) in project[column.name]"
                    :key="indexA"
                  >
                    <div v-for="model in column.badge.types" :key="model.value">
                      <BBadge
                        v-if="model.value === array.id"
                        :variant="model.type + '-subtle'"
                        :class="
                          'bg-' +
                          model.type +
                          '-subtle text-' +
                          model.type +
                          ' p-2'
                        "
                        >{{ array.display_name }}</BBadge
                      >
                    </div>
                  </div>
                </div>
                <div v-else>
                  <div v-for="model in column.badge.types" :key="model.value">
                    <BBadge
                      v-if="model.value === project[column.name]"
                      :variant="model.type + '-subtle'"
                      :class="
                        'bg-' +
                        model.type +
                        '-subtle text-' +
                        model.type +
                        ' p-2'
                      "
                      >{{ model.label }}</BBadge
                    >
                  </div>
                </div>
              </div>
              <div v-else-if="column.person" class="text-start">
                <strong
                  ><img
                    :src="column.person.pictureSrc"
                    class="rounded-circle avatar-xxs me-2"
                  />
                  <router-link
                    :to="{
                      name: column.person.routeName,
                      params: { id: project.id },
                    }"
                    >{{ project[column.name] }}</router-link
                  ></strong
                >
              </div>
              <div v-else>
                {{ project[column.name] }}
              </div>
              <BButton
                v-if="column.name === 'action'"
                variant="warning"
                @click="getData(project.id)"
                ><i class="text-light ri-pencil-fill"></i>
              </BButton>
            </td>
          </tr>
        </tbody>
      </datatable>
      <pagination
        :pagination="pagination"
        @prev="getProjects(pagination.prevPageUrl)"
        @next="getProjects(pagination.nextPageUrl)"
        @link="getProjects($event)"
      >
      </pagination>
    </div>
  </div>
</template>
