import { registerApplication, start } from "single-spa";
import axios from "axios";

axios
  .get("https://jw-service-list-mfe.herokuapp.com/applications")
  .then((resp) => {
    resp.data.forEach(({ name, url, activeWhen, exact }) => {
      registerApplication({
        name,
        app: () => System.import(url),
        activeWhen: exact
          ? (location) => location.pathname === `/${activeWhen}`
          : [activeWhen],
      });
    });
  })
  .finally(() => {
    console.log("finally");
    System.import("@jw-project/styleguide").then(() => {
      start({
        urlRerouteOnly: true,
      });
    });
  });
