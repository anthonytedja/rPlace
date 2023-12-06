var domain = window.location.host

export function buildUrl(url) {
  //return window.location.protocol + `//${domain}` + url;
  return `http://${domain}` + url
}