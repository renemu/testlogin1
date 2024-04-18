import { mapState, mapGetters, mapActions } from 'vuex'

export const authComputed = {
  ...mapState('auth', {
    currentUser: (state) => state.currentUser,
  }),
  ...mapGetters('auth', ['loggedIn']),
}

export const layoutComputed = {
  ...mapState('layout', {
    layoutType: (state) => state.layoutType,
    sidebarSize: (state) => state.sidebarSize,
    layoutWidth: (state) => state.layoutWidth,
    topbar: (state) => state.topbar,
    mode: (state) => state.mode,
    position: (state) => state.position,
    sidebarView: (state) => state.sidebarView,
    sidebarColor: (state) => state.sidebarColor,
    sidebarImage: (state) => state.sidebarImage,
    visibility: (state) => state.visibility
  })
}

export const authMethods = mapActions('auth', ['logIn', 'logOut', 'register', 'resetPassword'])

export const layoutMethods = mapActions('layout', 
['changeLayoutType', 'changeLayoutWidth', 'changeSidebarSize', 'changeTopbar', 'changeMode', 'changePosition', 'changeSidebarView',
 'changeSidebarColor','changeSidebarImage','changePreloader', 'changeVisibility'])

export const authFackMethods = mapActions('authfack', ['login', 'registeruser', 'logout'])

export const notificationMethods = mapActions('notification', ['success', 'error', 'clear'])

export const todoComputed = {
  ...mapState('todo', {
    todos: (state) => state.todos
  })
}
export const todoMethods = mapActions('todo', ['fetchTodos'])

// PRODUCT HELPERS

// Product --> Product

export const elektronikComputed = {
  ...mapState("elektronik/elektronik", {
    elektronik: (state) => state.elektronik,
    elektroniks: (state) => state.elektroniks
    // groups: (state) => state.groups,
    // pricings: (state) => state.pricings,
    // units: (state) => state.units,
    // detail: (state) => state.detail,
  }),
  ...mapGetters("elektronik/elektronik", [
    "elektroniks",
    "elektronik",
    // "groups",
    // "pricings",
    // "units",
    // "detail",
  ]),
};

export const elektronikMethods = mapActions("elektronik/elektronik", [
  "fetchElektroniks"
]);

// actress --> actress

export const actressComputed = {
  ...mapState("actress/actress", {
    actress: (state) => state.actress,
    actresses: (state) => state.actresses
    // groups: (state) => state.groups,
    // pricings: (state) => state.pricings,
    // units: (state) => state.units,
    // detail: (state) => state.detail,
  }),
  ...mapGetters("actress/actress", [
    "actresses",
    "actress",
    // "groups",
    // "pricings",
    // "units",
    // "detail",
  ]),
};

export const actressMethods = mapActions("actress/actress", [
  "fetchActresses"
]);