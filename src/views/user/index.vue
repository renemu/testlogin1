<script>
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";

export default {
  methods: {
    monthly() {
      document.getElementById('month-tab').classList.add('active');
      document.getElementById('annual-tab').classList.remove('active');
      const highlightedItems = document.querySelectorAll(".month");

      highlightedItems.forEach(function (userItem) {
        userItem.style.display = "block";
      });
      const highlightedItems2 = document.querySelectorAll(".annual");

      highlightedItems2.forEach(function (userItem) {
        userItem.style.display = "none";
      });
    },
    anually() {
      document.getElementById('month-tab').classList.remove('active');
      document.getElementById('annual-tab').classList.add('active');
      const highlightedItems = document.querySelectorAll(".month");

      highlightedItems.forEach(function (userItem) {
        userItem.style.display = "none";
      });
      const highlightedItems2 = document.querySelectorAll(".annual");

      highlightedItems2.forEach(function (userItem) {
        userItem.style.display = "block";
      });
    },
  },
  mounted() {
    const highlightedItems2 = document.querySelectorAll(".annual");

    highlightedItems2.forEach(function (userItem) {
      userItem.style.display = "none";
    });
  },
  components: {
    Layout,
    PageHeader,
  },
};
</script>

<template>
  <Layout>
    <PageHeader title="User List" pageTitle="User"/>
    <div>
        <span>user</span>
    </div>
    

    
  </Layout>
</template>
