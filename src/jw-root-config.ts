import { registerApplication, start } from "single-spa";
import axios from "axios";

type Response = {
  data: Array<{
    activeWhen: string;
    exact: boolean;
    isParcel: boolean;
    name: string;
    url: string;
  }>;
};

const mapper = {
  //"@jw-project/home-app": "http://localhost:8080/jw-project-home-app.js",
};

axios
  .get<unknown, Response>(
    "https://jw-project-58cb8-static.web.app/application.json"
  )
  .then(({ data }) => {
    if (Object.keys(mapper).length) {
      data = data.map((d) =>
        mapper[d.name] ? { ...d, url: mapper[d.name] } : d
      );
    }

    data.forEach(({ name, url, activeWhen, exact }) => {
      registerApplication({
        name,
        app: () => System.import(url),
        activeWhen: exact
          ? (location) => location.pathname === `${activeWhen}`
          : [activeWhen],
        customProps: { batatinha: "abc" },
      });
    });
  })
  .finally(async () => {
    await System.import("@jw-project/styleguide");
    await System.import("@jw-project/app-menu");
    await System.import("@jw-project/app-navbar");
    start({
      urlRerouteOnly: true,
    });
  });
