<script setup>
import UserActivityLogsDataTable from "../../../components/datatables/UserActivityLogsDataTable.vue";
import UserAccountLogsDataTable from "../../../components/datatables/UserAccountLogsDataTable.vue";
</script>

<script>
import Layout from "@/layouts/main.vue";
import "moment-timezone";
import apiClient from "../../../service/ApiClientService";
import ModalBasic from "../../../components/modals/basic.vue";
import BasicInput from "../../../components/inputs/basic.vue";
import PageHeader from "@/components/page-header";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import Swal from "sweetalert2";
import AdminActionButton from "../../../components/buttons/adminActionButton.vue";
import AdminOrOwnerElement from "../../../components/authorization/adminOrOwnerElement.vue";
import OwnerElement from "../../../components/authorization/ownerElement.vue";
import { userComputed, userMethods } from "@/state/helpers.js";
import moment from "moment";

export default {
  components: {
    Layout,
    ModalBasic,
    BasicInput,
    vSelect,
    AdminActionButton,
    AdminOrOwnerElement,
    OwnerElement,
    PageHeader,
  },
  data() {
    return {
      userId: this.$route.params.id,
      userProfileFormField: {},
      passwordFormField: {},
      userdepartment: null,
      userPosition: null,
      userEmploymentStart: null,
      userStaff: null,
      userLoginStatus: null,
      profileModal: false,
      staffModal: false,
      passwordModal: false,
      roleSelect: null,
      genderSelect: null,
      statusSelect: null,
      selecteddepartments: null,
      selectedPositions: null,
      inputProfile: [
        {
          id: 1,
          label: "Name",
          name: "name",
          inputType: "text",
          modelValue: "",
          required: true,
        },
        {
          id: 2,
          label: "Email",
          name: "email",
          inputType: "email",
          modelValue: "",
        },
        {
          id: 5,
          label: "Contact (Phone/Wa)",
          name: "phone",
          inputType: "phone",
          modelValue: "",
        },
      ],
      inputPassword: [
        {
          id: 1,
          label: "Password",
          name: "password",
          inputType: "password",
          modelValue: "",
        },
        {
          id: 2,
          label: "Password Confirmation",
          name: "password_confirmation",
          inputType: "password",
          modelValue: "",
        },
      ],
      optionsGender: [
        { value: "male", label: "Male" },
        { value: "female", label: "Female" },
      ],
      optionsStatus: [
        { value: 1, label: "Active" },
        { value: 0, label: "Suspended" },
      ],
      optionsdepartments: [],
      optionsPositions: [],
      employeeNickName: null,
      employeeEmploymentStart: null,
      employeeEmploymentEnd: null,
      checked: false,
      userLogsColumns: [
        { label: "ID", name: "tid", class: "text-center" },
        {
          label: "Activity",
          name: "activity",
          class: "text-start",
        },
        {
          label: "Staff",
          target: true,
          class: "text-center",
        },
        {
          label: "Time Stamp",
          name: "created_at",
          class: "text-center",
        },
      ],
      userAccountLogsColumns: [
        { label: "ID", name: "tid", class: "text-center" },
        {
          label: "Activity",
          name: "activity",
          class: "text-start",
        },
        {
          label: "Setter",
          setter: true,
          class: "text-center",
        },
        {
          label: "Time Stamp",
          name: "created_at",
          class: "text-center",
        },
      ],
    };
  },

  computed: {
    ...userComputed,
  },
  methods: {
    ...userMethods,
    goToCreator(creatorId) {
      this.setDataUser(creatorId);
      this.fetchLogs(creatorId);
    },
    formatDate(date, dateType) {
      const types = [
        { name: "iso", dateFormat: "YYYY-MM-DDTHH:mm:ss.SSS[Z]" },
        { name: "normal", dateFormat: "DD-MM-YYYY HH:mm:ss" },
      ];
      let formatedDate = "";
      if (date) {
        types.forEach((element) => {
          if (element.name === dateType) {
            return (formatedDate = moment(date, element.dateFormat).format(
              "DD MMM YYYY - HH:mm:ss"
            ));
          }
        });
      } else {
        return "";
      }
      return formatedDate;
    },
    onSubmit() {
      this.userProfileFormField.role = this.roleSelect.value;
      this.userProfileFormField.gender = this.genderSelect.value;
      this.userProfileFormField.status = this.statusSelect.value;
      let updatedData = {
        id: this.userId,
        data: this.userProfileFormField,
      };
      this.updateUser(updatedData);
      this.profileModal = !this.profileModal;
    },
    submitStaffForm() {
      let staffData = {
        nick_name: this.employeeNickName,
        employment_start: this.employeeEmploymentStart,
        employment_end: this.employeeEmploymentEnd,
        departments: this.selecteddepartments.map((e) => e.value),
        positions: this.selectedPositions.map((e) => e.value),
      };
      apiClient
        .put(`user/users/${this.userId}/employee`, staffData)
        .then((response) => {
          this.employeeNickName = response.data.nick_name;
          this.userStaff = response.data.id;
          this.userdepartment = response.data.departments;
          this.userPosition = response.data.positions;
          this.userEmploymentStart = response.data.employment_start;
          Swal.fire("Success", response.message, "success").then((e) => {
            if (e.isConfirmed) {
              this.toggleStaffModal();
            }
          });
        })
        .catch((error) =>
          Swal.fire("Error", error.response.data.message, "error")
        );
    },
    submitPasswordForm() {
      let payload = {
        id: this.userId,
        data: this.passwordFormField,
      };
      this.updatePassword(payload);
      this.togglePasswordModal();
    },
    toggleProfileModal() {
      this.fetchCreate();
      if (this.profileModal == false) {
        this.inputProfile.forEach((element) => {
          this.userProfileFormField[element.name] = this.user[element.name];
        });
        console.log(this.userProfileFormField);
        this.roleSelect = {
          value: this.user.role.id,
          label: this.user.role.display_name,
        };
        this.optionsGender.forEach((element) => {
          if (element.value === this.user.gender) {
            return (this.genderSelect = element);
          }
        });
        this.optionsStatus.forEach((element) => {
          if (element.value === this.user.status) {
            return (this.statusSelect = element);
          }
        });
      }
      this.profileModal = !this.profileModal;
    },
    toggleStaffModal() {
      if (this.staffModal == false) {
        apiClient.get(`/user/users/${this.userId}/employee`).then((res) => {
          this.optionsdepartments = res.params.departments;
          this.optionsPositions = res.params.positions;
          this.employeeNickName = res.data.nick_name;
          this.employeeEmploymentStart = res.data.employment_start;
          this.selecteddepartments = res.data.departments.map((e) => ({
            value: e.id,
            text: e.display_name,
          }));
          this.selectedPositions = res.data.positions.map((e) => ({
            value: e.id,
            text: e.display_name,
          }));
        });
      }
      this.staffModal = !this.staffModal;
    },
    togglePasswordModal() {
      this.passwordModal = !this.passwordModal;
    },
    toggleCheckbox() {
      this.checked = !this.checked;
    },
  },
  mounted() {
    this.setDataUser(this.userId);
    this.fetchLogs(this.userId);
  },
};
</script>

<template>
  <Layout>
    <PageHeader
      title="User Detail"
      :pageTitle="{ title: 'User List', routeName: 'user.index' }"
    />
    <div class="row">
      <div class="col-lg-12">
        <div class="card" id="userDetail">
          <div class="card-header">
            <h5 class="card-title mb-0 cnt-userName">{{ user.name }}</h5>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <table class="table table-striped">
                  <tbody>
                    <tr>
                      <td width="35%">
                        Name <span class="pull-right">:</span>
                      </td>
                      <td>
                        <i class="ri-user-line align-bottom me-1"></i
                        >{{ user.name }}
                      </td>
                    </tr>
                    <tr v-if="user.employee?.department">
                      <td width="35%">
                        Department <span class="pull-right">:</span>
                      </td>
                      <td>
                        <span
                          ><i class="las la-hotel me-1 text-muted"></i> </span
                        ><router-link
                          :to="{
                            name: 'company.departments.detail',
                            params: { id: user.employee?.department?.id },
                          }"
                          ><strong>{{
                            user.employee?.department?.display_name
                          }}</strong></router-link
                        >
                      </td>
                    </tr>
                    <tr v-if="user.employee?.position">
                      <td width="35%">
                        Position <span class="pull-right">:</span>
                      </td>
                      <td>
                        <div class="d-flex">
                          <i
                            class="pink ri-briefcase-line align-bottom me-1"
                          ></i>
                          <div class="mx-1">
                            <router-link
                              :to="{
                                name: 'company.positions.detail',
                                params: { id: user.employee?.position?.id },
                              }"
                              ><strong>{{
                                user.employee?.position?.display_name
                              }}</strong></router-link
                            >
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr v-if="user.employee?.metadata?.employment_start">
                      <td width="35%">
                        Employment Start <span class="pull-right">:</span>
                      </td>
                      <td>
                        <i class="ri-calendar-line align-bottom me-1"></i>
                        {{ user.employee?.metadata?.employment_start }}
                      </td>
                    </tr>
                    <tr v-if="user.employee">
                      <td width="35%">
                        Staff <span class="pull-right">:</span>
                      </td>
                      <td>
                        <i class="ri-user-line align-bottom me-1"></i>
                        <router-link
                          :to="{
                            name: 'company.employees.detail',
                            params: { id: user.employee?.id },
                          }"
                          >View Staff Info</router-link
                        >
                      </td>
                    </tr>
                    <tr>
                      <td width="35%">
                        Login Status <span class="pull-right">:</span>
                      </td>
                      <td>
                        <span
                          v-if="user.status === 1"
                          class="bg-success-subtle text-success rounded p-1"
                          >Active</span
                        >
                        <span
                          v-else-if="user.status === 0"
                          class="bg-danger-subtle text-danger rounded p-1"
                          >Suspended</span
                        >
                        <span
                          v-else
                          class="bg-success-subtle text-success rounded p-1"
                          >Suspended</span
                        >
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!-- End Col -->

              <div class="col-md-6">
                <table class="table table-striped">
                  <tbody>
                    <tr>
                      <td width="35%">
                        Email <span class="pull-right">:</span>
                      </td>
                      <td>
                        <i class="ri-mail-line align-bottom me-1"></i
                        >{{ user.email }}
                      </td>
                    </tr>
                    <tr>
                      <td width="35%">
                        Phone/WA <span class="pull-right">:</span>
                      </td>
                      <td>
                        <i class="ri-phone-line align-bottom me-1"></i
                        >{{ user.phone }}
                      </td>
                    </tr>
                    <tr>
                      <td width="35%">
                        Register <span class="pull-right">:</span>
                      </td>
                      <td>
                        {{ formatDate(user?.created_at, "normal") }} - by
                        <router-link
                          v-if="user.creator"
                          :to="{
                            name: 'user.detail',
                            params: { id: user.creator.id },
                          }"
                          @click.prevent="goToCreator(user.creator.id)"
                          >{{ user.creator.name }}</router-link
                        >
                      </td>
                    </tr>
                    <tr>
                      <td width="35%">
                        Last Login <span class="pull-right">:</span>
                      </td>
                      <td>
                        {{
                          formatDate(
                            user?.metadata?.last_login?.created_at,
                            "iso"
                          )
                        }}
                      </td>
                    </tr>
                    <tr>
                      <td width="35%">
                        Last Activity <span class="pull-right">:</span>
                      </td>
                      <td>
                        {{
                          formatDate(
                            user?.metadata?.last_activity?.created_at,
                            "iso"
                          )
                        }}
                      </td>
                    </tr>
                    <tr>
                      <td width="35%">
                        Auth/Role <span class="pull-right">:</span>
                      </td>
                      <td>
                        <div v-if="user.role">
                          <div>
                            <span
                              class="rounded p-1"
                              :class="
                                user.role.name == 'super_admin'
                                  ? 'bg-danger-subtle text-danger'
                                  : user.role.name == 'admin'
                                  ? 'bg-primary-subtle text-primary'
                                  : 'bg-warning-subtle text-warning'
                              "
                              >{{ user.role.display_name }}</span
                            >
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <AdminActionButton>
            <div class="card-footer">
              <div class="row">
                <div class="col-md-6 mb-1 mt-1">
                  <button
                    type="button"
                    class="btn btn-primary m-1"
                    @click="toggleProfileModal"
                  >
                    <i class="ri-user-settings-line align-bottom me-1"></i>
                    Edit Profile
                  </button>
                  <button
                    v-if="userStaff"
                    type="button"
                    class="btn btn-info m-1"
                    @click="toggleStaffModal"
                  >
                    <i class="ri-user-settings-line align-bottom me-1"></i>
                    Edit Staff
                  </button>
                  <router-link
                    :to="{ name: 'user.privileges', params: { id: userId } }"
                    class="btn btn-success"
                  >
                    <i class="ri-shield-user-line align-bottom me-1"></i>
                    Edit Privileges
                  </router-link>
                </div>
                <div class="col-md-6 mb-1 mt-1">
                  <button
                    type="button"
                    class="btn btn-warning m-1"
                    @click="togglePasswordModal"
                  >
                    <i class="ri-lock-2-line align-bottom me-1"></i>
                    Edit Password
                  </button>
                </div>
              </div>
            </div>
          </AdminActionButton>
          <OwnerElement :userId="userId">
            <div class="card-footer">
              <div class="row">
                <div class="col-md-6 mb-1 mt-1">
                  <router-link
                    :to="{ name: 'auth.profile' }"
                    class="btn btn-primary m-1"
                  >
                    <i class="ri-user-settings-line align-bottom me-1"></i>
                    Edit My Profile
                  </router-link>
                </div>
              </div>
            </div>
          </OwnerElement>
          <div class="card-footer">
            <i class="ri-arrow-left-line"></i>
            <router-link :to="{ name: 'user.index' }">
              Back to list
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <AdminOrOwnerElement :userId="userId">
      <div class="card">
        <div class="card-header">
          <div class="row">
            <div class="col-md-12">
              <h5 class="card-title mb-0 cnt-userName">Last Log Activity</h5>
            </div>
          </div>
        </div>
        <div class="card-body table-responsive">
          <UserActivityLogsDataTable
            id="activityTable"
            :key="componentKey"
            ref="table"
            :search_column="search_column"
            :url="`/user/users/${userId}/activity-logs`"
            :column="userLogsColumns"
            :edit="getData"
          />
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <div class="row">
            <div class="col-md-12">
              <h5 class="card-title mb-0 cnt-userName">Account Logs</h5>
            </div>
          </div>
        </div>
        <div class="card-body table-responsive">
          <UserAccountLogsDataTable
            id="accountTable"
            :key="componentKey"
            ref="accountTable"
            :search_column="search_column"
            :url="`/user/users/${userId}/account-logs`"
            :column="userAccountLogsColumns"
          />
        </div>
      </div>
    </AdminOrOwnerElement>

    <ModalBasic title="Update Profile" sizeClass="" v-model="profileModal">
      <template #body>
        <form id="update_profile_form" @submit.prevent="onSubmit">
          <div class="mt-1">
            <label for="role_select">Role</label>
            <v-select
              id="role_select"
              v-model="roleSelect"
              :options="roles"
              placeholder="Select Roles"
            />
          </div>
          <div v-for="input in inputProfile" :key="input.id" class="col-xxl-12">
            <BasicInput
              :label="input.label"
              :type="input.inputType"
              :name="input.name"
              :placeholder="input.label"
              v-model="userProfileFormField[input.name]"
              :required="input.required ? true : false"
            />
          </div>
          <div class="mt-1">
            <label for="gender_select">Gender</label>
            <v-select
              id="gender_select"
              v-model="genderSelect"
              :options="gender"
              placeholder="Select Gender"
            />
          </div>
          <div class="mt-1">
            <label for="auth_select">Auth</label>
            <v-select
              id="auth_select"
              v-model="statusSelect"
              :options="optionsStatus"
              placeholder="Auth Status"
            />
          </div>
        </form>
      </template>
      <template #footer>
        <BRow>
          <BCol class="mt-4" lg="5">
            <input
              v-model="checked"
              type="checkbox"
              id="checkboxEditProfile"
              style="margin-right: 4px"
            />
            <label for="checkboxEditProfile">Confirm</label>
          </BCol>
          <BCol lg="7" class="hstack gap-2 justify-content-end">
            <div>
              <BButton
                style="margin-right: 1em"
                type="button"
                variant="light"
                @click="profileModal = false"
              >
                Close
              </BButton>
              <BButton
                form="update_profile_form"
                type="submit"
                variant="primary"
                :class="!checked ? 'disabled' : ''"
                >Update</BButton
              >
            </div>
          </BCol>
        </BRow>
      </template>
    </ModalBasic>

    <ModalBasic title="Edit Staff" v-model="staffModal">
      <template #body>
        <form @submit.prevent="submitStaffForm" id="editStafForm">
          <BasicInput
            v-model="employeeNickName"
            name="nick_name"
            label="Staff ID/Nickname"
            type="text"
            required
          />
          <div class="mt-1">
            <label for="department">department</label>
            <v-select
              id="department"
              v-model="selecteddepartments"
              :options="optionsdepartments"
              :label="'text'"
              placeholder="Select department"
              multiple
            />
          </div>
          <div class="mt-1">
            <label for="positions">Positions</label>
            <v-select
              id="positions"
              v-model="selectedPositions"
              :options="optionsPositions"
              :label="'text'"
              placeholder="Select Positions"
              multiple
            />
          </div>
          <BasicInput
            v-model="employeeEmploymentStart"
            name="employment_start"
            label="Employment Start"
            type="text"
            required
          />
          <BasicInput
            v-model="employeeEmploymentEnd"
            name="employment_end"
            label="Employment End"
            type="text"
          />
        </form>
      </template>
      <template #footer>
        <div class="row">
          <div class="col col-lg-5 mt-4">
            <input
              v-model="checked"
              type="checkbox"
              id="checkboxEditProfile"
              style="margin-right: 4px"
            />
            <label for="checkboxEditProfile">Confirm</label>
          </div>
          <div class="col col-lg-7 hstack gap-2 justify-content-end">
            <div>
              <button
                class="btn btn-light"
                style="margin-right: 1em"
                type="button"
                @click="showModal = false"
              >
                Close
              </button>
              <button
                class="btn btn-primary"
                form="editStafForm"
                type="submit"
                :class="!checked ? 'disabled' : ''"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </template>
    </ModalBasic>

    <ModalBasic title="Change Password" v-model="passwordModal">
      <template #body>
        <form id="passwordForm" @submit.prevent="submitPasswordForm">
          <div
            v-for="input in inputPassword"
            :key="input.id"
            class="col-xxl-12"
          >
            <BasicInput
              :label="input.label"
              :type="input.inputType"
              :name="input.name"
              :placeholder="input.label"
              v-model="passwordFormField[input.name]"
              :required="input.required ? true : false"
            />
          </div>
        </form>
      </template>
      <template #footer>
        <BRow>
          <BCol class="mt-4" lg="5">
            <input
              v-model="checked"
              type="checkbox"
              id="checkboxEditProfile"
              style="margin-right: 4px"
            />
            <label for="checkboxEditProfile">Confirm</label>
          </BCol>
          <BCol lg="7" class="hstack gap-2 justify-content-end">
            <div>
              <BButton
                style="margin-right: 1em"
                type="button"
                variant="light"
                @click="togglePasswordModal"
              >
                Close
              </BButton>
              <BButton
                form="passwordForm"
                type="submit"
                variant="primary"
                :class="!checked ? 'disabled' : ''"
                >Update</BButton
              >
            </div>
          </BCol>
        </BRow>
      </template>
    </ModalBasic>
  </Layout>
</template>
