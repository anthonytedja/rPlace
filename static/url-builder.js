var domain = window.location.hostname

export function buildUrl(url) {
  //return window.location.protocol + `//${domain}` + url;
  return `http://${domain}` + url
}