export function getAvatar(avatar){
  if (
    avatar == undefined ||
    avatar == null ||
    avatar == "null" ||
    avatar == "default"
  ) {
    return require("@/assets/images/logo-avatar.webp");
  }
  if (!avatar.includes("/storage/profile/")) {
    return process.env.VUE_APP_ARJUNA_ASSET_URL + "/stocks/" + avatar;
  } else {
    return process.env.VUE_APP_ASSET_URL + avatar;
  }
}