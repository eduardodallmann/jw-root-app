import {
  registerApplication,
  getAppNames,
  start,
  mountRootParcel,
} from "single-spa";
import axios from "axios";
import * as firebaseLibApp from "firebase/app";
import * as firebaseLibAuth from "firebase/auth";
import * as firebaseLibFirestore from "firebase/firestore";
import { firebaseConfig } from "./firebase-config";
import { hideLoading, showLoading, showLogin, showApp } from "./control-dom";
import type { ApplicationCustomProps, Response } from "./types";
import { BehaviorSubject } from "rxjs";

const { initializeApp } = firebaseLibApp;
const {
  getAuth,
  getRedirectResult,
  setPersistence,
  indexedDBLocalPersistence,
} = firebaseLibAuth;

const mapper = {
  // "@jw-project/home-app": "http://localhost:8600/jw-project-home-app.js",
};

initializeApp(firebaseConfig);
const auth = getAuth();
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
      registerApplication<ApplicationCustomProps>({
        name,
        app: () => System.import(url),
        activeWhen: exact
          ? (location) => location.pathname === `${activeWhen}`
          : [activeWhen],
        customProps: {
          firebaseLibApp,
          firebaseLibAuth,
          firebaseLibFirestore,
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

  getRedirectResult(auth)
    .then(async (result) => {
      console.log("then------------", result);
      await setPersistence(auth, indexedDBLocalPersistence);
      console.log("currentUser is:", auth.currentUser);

      const data = await register(Boolean(auth.currentUser));

      for (const { name } of data.filter(({ isStructural }) => isStructural)) {
        await System.import(name);
      }

      start({
        urlRerouteOnly: true,
      });
      showApp();
    })
    .catch(async (e) => {
      console.log("catch--------", e);
      await System.import("@jw-project/app-login");
      await register(Boolean(auth.currentUser));

      start({
        urlRerouteOnly: true,
      });

      showLogin();
    })
    .finally(async () => {
      hideLoading();
      await loadingParcel.unmount();
    });
}

runRoot();
