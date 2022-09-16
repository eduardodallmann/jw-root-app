import type * as firebaseLibApp from "firebase/app";
import type * as firebaseLibAuth from "firebase/auth";
import type * as firebaseLibFirestore from "firebase/firestore";
import type { BehaviorSubject } from "rxjs";

export type Response = {
  data: Array<{
    activeWhen: string;
    exact: boolean;
    isParcel: boolean;
    isStructural: boolean;
    name: string;
    url: string;
  }>;
};

export type ApplicationCustomProps = {
  name: string;
  firebaseLibApp: typeof firebaseLibApp;
  firebaseLibAuth: typeof firebaseLibAuth;
  firebaseLibFirestore: typeof firebaseLibFirestore;
  titleObservable: BehaviorSubject<string>;
  themeObservable: BehaviorSubject<string>;
};
