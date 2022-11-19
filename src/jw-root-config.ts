import {
  registerApplication,
  getAppNames,
  start,
  mountRootParcel,
} from "single-spa";
import axios from "axios";
import { hideLoading, showLoading, showLogin, showApp } from "./control-dom";
import type { Response } from "./types";
import { BehaviorSubject } from "rxjs";
import { auth, types } from "@jw-project/api";

const mapper = {
  // "@jw-project/mfe-home": "http://localhost:8600/jw-project-mfe-home.js",
};

const titleObservable = new BehaviorSubject("titulo padrão");
const themeObservable = new BehaviorSubject("claro");

async function register(authenticated: boolean) {
  console.log("register authenticated is", authenticated);
  let { data } = await axios.get<unknown, Response>(
    "https://jw-project-58cb8-static.web.app/application.json"
  );
  if (Object.keys(mapper).length) {
    data = data.map((d) =>
      mapper[d.name] ? { ...d, url: mapper[d.name] } : d
    );
  }
  console.log(data);

  if (!authenticated) {
    data = data.filter(({ name }) => name.includes("login"));
    console.log(data);
  } else {
    data = data.filter(({ name }) => !name.includes("login"));
    console.log(data);
  }

  data.forEach(({ name, url, activeWhen, exact, isStructural }) => {
    console.log(getAppNames(), name);

    if (!getAppNames().includes(name)) {
      const customDomElement: { domElement?: HTMLElement } = {};
      if (!isStructural) {
        customDomElement.domElement =
          document.getElementById("root-apps-route");
      }
      registerApplication<Omit<types.ApplicationCustomProps, "name">>({
        name,
        app: () => System.import(url),
        activeWhen: exact
          ? (location) => location.pathname === `${activeWhen}`
          : [activeWhen],
        customProps: {
          titleObservable,
          themeObservable,
          ...customDomElement,
        },
      });
    }
  });

  return data;
}

async function runRoot() {
  await System.import("@jw-project/styleguide");

  const loadingParcel = mountRootParcel<{}>(
    () => System.import("@jw-project/app-loading"),
    {
      domElement: document.getElementById("root-loading"),
    }
  );

  showLoading();

  await System.import("@jw-project/api");

  await auth.verifyIsAuthenticated(
    async (_, currentUser) => {
      const data = await register(Boolean(currentUser));

      for (const { name } of data.filter(({ isStructural }) => isStructural)) {
        await System.import(name);
      }

      start({
        urlRerouteOnly: true,
      });
      showApp();
    },
    async (currentUser) => {
      await System.import("@jw-project/app-login");
      await register(Boolean(currentUser));

      start({
        urlRerouteOnly: true,
      });

      showLogin();
    },
    async () => {
      hideLoading();
      await loadingParcel.unmount();
    }
  );
}

runRoot();
