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
