import * as firebaseLibApp from "firebase/app";
import * as firebaseLibAuth from "firebase/auth";
import * as firebaseLibFirestore from "firebase/firestore";
import { BehaviorSubject } from "rxjs";

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
  firebaseLibApp: typeof firebaseLibApp;
  firebaseLibAuth: typeof firebaseLibAuth;
  firebaseLibFirestore: typeof firebaseLibFirestore;
  titleObservable: BehaviorSubject<string>;
  themeObservable: BehaviorSubject<string>;
};
