var domain = "localhost:8080"

export function buildUrl(url) {
  //return window.location.protocol + `//${domain}` + url;
  return `http://${domain}` + url
}