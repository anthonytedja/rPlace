// TODO: get static URL for load balancer

const devMode = false

const domain = devMode
  ? window.location.host
  : 'stack-Elasti-RGQcGge2dGpi-492931940.us-east-1.elb.amazonaws.com'
export const socketUrl = fetch(buildUrl('/api/get-server')).then((res) => res.text())

export function buildUrl(url) {
  return `http://${domain}` + url
}
