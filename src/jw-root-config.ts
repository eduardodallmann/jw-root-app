import { registerApplication, start } from "single-spa";

registerApplication({
  name: "@single-spa/welcome",
  app: () =>
    System.import(
      "https://unpkg.com/single-spa-welcome/dist/single-spa-welcome.js"
    ),
  activeWhen: ["/"],
});

registerApplication({
  name: "@jw/grupos-app",
  app: () => System.import('@jw/grupos-app'),
  activeWhen: ["/react"]
});

start({
  urlRerouteOnly: true,
});
