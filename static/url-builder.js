// TODO: get static URL for load balancer
const domain = 'csc409-elast-rxtsetee3dyp-1841875591.us-east-1.elb.amazonaws.com'

export const socketUrl = await fetch(buildUrl('/api/get-server'))
    .then(res => res.text())

export function buildUrl(url) {
  //return window.location.protocol + `//${domain}` + url;
  return `http://${domain}` + url
}