import { registerApplication, start } from "single-spa";
import axios from "axios";

axios
  .get("https://jw-service-list-mfe.herokuapp.com/application")
  .then((resp) => {
    resp.data.forEach(({ name, url, activeWhen, exact }) => {
      registerApplication({
        name,
        app: () => System.import(url),
        activeWhen: exact
          ? (location) => location.pathname === `/${activeWhen}`
          : [`/${activeWhen}`],
      });
    });
  });

start({
  urlRerouteOnly: true,
});
