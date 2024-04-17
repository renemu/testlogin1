<script>
// import { required, helpers } from "@vuelidate/validators";
import apiClient from "../../service/apiClientService";
import Swal from "sweetalert2";
import router from "../../router";

export default {
  data() {
    return {
      user_identity: null,
      password: "",
      submitted: false,
      processing: false,
    };
  },
  methods: {
    signIn() {
      let loginData = {
        user_identity: this.user_identity,
        password: this.password,
      };
      this.processing = true;
      apiClient
        .post("https://dev-backend-arjuna.gawebecik.id/api/auth/login", loginData, { authorization: false })
        .then((response) => {
          localStorage.setItem("token", JSON.stringify(response.data.token));
          localStorage.setItem("user", JSON.stringify(response.data.user));
          localStorage.setItem("avatar", response.data.user.avatar);
          localStorage.setItem("role", JSON.stringify(response.data.role));
          localStorage.setItem(
            "settings",
            JSON.stringify(response.data.settings)
          );
          localStorage.setItem(
            "permissions",
            JSON.stringify(response.data.permissions)
          );
          router.push("/dashboard");
        })
        .catch((error) => {
          if (error.response != undefined) {
            Swal.fire("Error", error.response.data.message, "error");
          }
        })
        .finally(() => (this.processing = false));
    },
  },
};
</script>


<template>
  <div class="auth-page-wrapper pt-5">
    <div class="auth-one-bg-position auth-one-bg" id="auth-particles">
      <div class="bg-overlay"></div>

      <div class="shape">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 1440 120">
          <path
            d="M 0,36 C 144,53.6 432,123.2 720,124 C 1008,124.8 1296,56.8 1440,40L1440 140L0 140z"></path>
        </svg>
      </div>
    </div>

    <div class="auth-page-content">
      <BContainer>
        <BRow>
          <BCol lg="12">
            <div class="text-center mt-sm-5 mb-4 text-white-50">
              <div>
                <router-link to="/" class="d-inline-block auth-logo">
                  <!-- <p><h1>LOGIN</h1></p> -->
                  <img
                    src="@/assets/images/logo-light.png"
                    alt=""
                    height="20" />
                </router-link>
              </div>
              <p class="mt-3 fs-15 fw-medium">
                Premium Admin & Dashboard Template
              </p>
            </div>
          </BCol>
        </BRow>

        <BRow class="justify-content-center">
          <BCol md="8" lg="6" xl="5">
            <BCard no-body class="mt-4">
              <BCardBody class="p-4">
                <div class="text-center mt-2">
                  <h5 class="text-primary">Welcome Back !</h5>
                  <p class="text-muted">Sign in to continue</p>
                </div>
                <div class="p-2 mt-4">
                  <div></div>

                  <form @submit.prevent="signIn">
                    <div class="mb-3">
                      <label for="email" class="form-label">Email</label>
                      <input
                        type="email"
                        class="form-control"
                        id="email"
                        placeholder="Enter email"
                        v-model="user_identity"
                        required />
                      <div class="invalid-feedback">
                        <span></span>
                      </div>
                    </div>

                    <div class="mb-3">
                      <label class="form-label" for="password-input"
                        >Password</label
                      >
                      <div class="position-relative auth-pass-inputgroup mb-3">
                        <input
                          type="password"
                          v-model="password"
                          class="form-control pe-5"
                          placeholder="Enter password"
                          id="password-input"
                          required />
                        <BButton
                          variant="link"
                          class="position-absolute end-0 top-0 text-decoration-none text-muted"
                          type="button"
                          id="password-addon">
                        </BButton>
                        <div class="invalid-feedback">
                          <span></span>
                        </div>
                      </div>
                    </div>
                    <div class="form-label float-end">
                      <router-link to="/forgot-password" class="text-muted"
                        >Forgot password?</router-link
                      >
                    </div>

                    <div class="mt-4">
                      <BButton variant="success" class="w-100" type="submit">
                        Sign In
                      </BButton>
                    </div>
                  </form>
                </div>
              </BCardBody>
            </BCard>

            <div class="mt-4 text-center">
              <p class="mb-0">
                Don't have an account ?
                <router-link
                  to="/register"
                  class="fw-semibold text-primary text-decoration-underline">
                  Signup
                </router-link>
              </p>
            </div>
          </BCol>
        </BRow>
      </BContainer>
    </div>

    <footer class="footer">
      <BContainer>
        <BRow>
          <BCol lg="12">
            <div class="text-center">
              <p class="mb-0 text-muted">
                &copy; {{ new Date().getFullYear() }} Velzon. Crafted with
                <i class="mdi mdi-heart text-danger"></i> by Themesbrand
              </p>
            </div>
          </BCol>
        </BRow>
      </BContainer>
    </footer>
  </div>
</template>
