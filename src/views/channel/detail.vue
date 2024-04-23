<script>
/* eslint-disable */
import Layout from "@/layouts/main.vue";
import { channelComputed, channelMethods } from "@/state/helpers.js";
import moment from "moment";
import ModalBasic from "@/components/modals/basic.vue";
import BasicInput from "@/components/inputs/basic.vue";
import PageHeader from "@/components/page-header.vue";
import { getAvatar } from "@/utils/assetsHelper";
// import vSelect from "vue-select";
// import "vue-select/dist/vue-select.css";

export default {
  components: {
    Layout,
    ModalBasic,
    BasicInput,
    // vSelect,
    PageHeader,
  },
  data() {
    return {
      channelId: this.$route.params.id,
      formData: {},
      inputFields: [
        {
          id: 1,
          label: "Name",
          name: "display_name",
          inputType: "text",
          modelValue: "",
          placeholder: "Channel Name",
          required: true,
        },
        {
          id: 2,
          label: "URL",
          name: "url",
          inputType: "url",
          modelValue: "",
          placeholder: "Channel Url",
          required: false,
        },
        {
          id: 3,
          label: "Type",
          name: "type",
          inputType: "text",
          modelValue: "",
          placeholder: "Type",
          required: true,
        },
      ],
      modalShow: false,
      checked: false,
    };
  },
  computed: {
    ...channelComputed,
  },
  methods: {
    ...channelMethods,
    avatar: (avatar) => getAvatar(avatar),
    openEditModal() {
      this.checked = false;
      this.inputFields.forEach((e) => {
        this.formData[e.name] = this.channel[e.name];
      });
      this.formData.platform = this.channel.platform
        ? {
            label: this.channel.platform,
            value: this.channel.platform,
          }
        : null;
      this.formData.type = this.channel.type
        ? {
            label: this.channel.type,
            value: this.channel.type,
          }
        : null;
      this.modalShow = !this.modalShow;
    },
    submitEditChannel() {
      this.formData.platform = this.formData.platform.value;
      this.formData.type = this.formData.type.value;
      const payload = {
        data: this.formData,
        id: this.channelId,
      };
      this.updateChannel(payload);
      this.modalShow = !this.modalShow;
    },
    formatDate(date) {
      if (date) {
        return moment(date, "YYYY-MM-DDTHH:mm:ss.SSS[Z]").format(
          "DD MMM YYYY - HH:mm:ss"
        );
      }
      return "";
    },
    deleteData() {
      this.deletechannel(this.channel.id);
      this.modalShow = false;
      this.checked = false;
      this.$router.push({
        name: "channel.index",
      });
    },
  },
  mounted() {
    // this.fetchParams();
    this.setDataChannel(this.channelId);
  },
};
</script>
<template>
  <Layout>
    <PageHeader
      title="Channel Detail"
      :pageTitle="{
        title: 'Channel List',
        routeName: 'channel.index',
      }"
    />
    <div class="row">
      <div class="col-lg-12">
    <BCard no-body>
    <BCardHeader>
            <h6 class="card-title mb-0">
              {{ channel?.display_name }}
            </h6>
          </BCardHeader>
          <BCardBody>
            <div class="row">
              <div class="col-md-6">
                <table class="table table-striped">
                  <tbody>
                    <tr>
                      <th width="35%" scope="row">Channel</th>
                      <td>{{ channel?.display_name }}</td>
                    </tr>
                    <tr v-if="channel?.parent">
                      <th width="35%" scope="row">Parent</th>
                      <td>
                        <router-link
                          :to="{
                            name: 'company.channels.detail',
                            params: { id: channel?.parent?.id },
                          }"
                          @click.prevent="goToParent(channel?.parent?.id)"
                        >
                          <i class="las la-hotel me-1 text-muted"></i>
                          <strong>
                            {{ channel?.parent?.display_name }}
                          </strong>
                        </router-link>
                      </td>
                    </tr>
                    <tr v-if="channel?.url">
                      <td width="35%">URL</td>
                      <td>
                        <strong
                          ><a
                            :href="channel?.url"
                            target="_blank"
                            rel="noopener noreferrer"
                            >{{ channel?.url }}</a
                          ></strong
                        >
                      </td>
                    </tr>
                    <tr v-if="channel?.platform">
                      <th width="35%" scope="row">Platform</th>
                      <td>
                        <strong>
                          <i class="ri-shopping-bag-line align-bottom me-1"></i>
                        </strong>
                        {{ channel?.platform }}
                      </td>
                    </tr>
                    <tr>
                      <th width="35%" scope="row">Type</th>
                      <td>
                        <strong>
                          <i class="ri-shopping-bag-line align-bottom me-1"></i>
                        </strong>
                        {{ channel?.type }}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div class="mt-1">
                  <button 
                  type="button"
                  class="btn btn-info btn-sm"
                  @click="openEditModal">
                  <i class="ri-pencil-line align-bottom me-1"></i>
                    Edit Channel
                  </button>
                </div>
              </div>
              <div class="col-md-6">
                <table class="table table-striped">
                  <tbody>
                    <tr>
                      <th scope="row">Added:</th>
                      <td>
                        {{ formatDate(channel?.created_at) }} - by
                        name
                      </td>
                    </tr>
                    <tr v-if="channel.created_at !== channel.updated_at">
                      <th scope="row">Modified:</th>
                      <td>
                        {{ formatDate(channel?.updated_at) }} - by
                        <router-link
                          :to="{
                            name: 'user.detail',
                            params: { id: channel?.updater?.id },
                          }"
                          >{{ channel?.updater?.name }}</router-link
                        >
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div class="mt-1">
                  <a class="btn btn-soft-success btn-sm" href="/dashboard">
                    <i class="ri-time-line align-bottom me-1"></i>
                    History
                  </a>
                </div>
              </div>
            </div>
          </BCardBody>
          <BCardFooter>
            <div class="hstack gap-2 justify-content-4start">
              <router-link :to="{ name: 'channel.index' }"
                ><i class="ri-arrow-left-line" style="margin-right: 6px"></i
                >Back to list
              </router-link>
            </div>
          </BCardFooter>
        </BCard>
      </div>
    </div>
    <ModalBasic title="Edit Channel" v-model="modalShow">
      <template #body>
        <form id="addChannel" @submit.prevent="submitEditChannel">
          <div v-for="input in inputFields" :key="input.id">
            <BasicInput
              v-model="formData[input.name]"
              :name="input.name"
              :label="input.label"
              :type="input.inputType"
              :placeholder="input.placeholder"
              :required="input.required"
            />
          </div>
          
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
                @click="modalShow = !modalShow"
              >
                Close
              </button>
              <button
                class="btn btn-primary"
                form="addChannel"
                type="submit"
                :class="!checked ? 'disabled' : ''"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </template>
    </ModalBasic>
  </Layout>
</template>
