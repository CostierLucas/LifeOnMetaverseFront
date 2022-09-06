// Edition
export type IEdition = {
  map(
    arg0: (item: IEdition, i: number) => JSX.Element
  ): import("react").ReactNode;
  artist: string;
  title: string;
  description: string;
  type: string;
  supply: Array<string>;
  categories: Array<string>;
  baseUri: Array<string>;
  price: Array<number>;
  percentages: Array<number>;
  address: string;
  image: File | null | string;
  [key: number]: any;
  titleList: Array<Array<string>>;
  date: number;
  royalty: number;
};

export interface IEditionProps {
  editions: IEdition;
}

// Modal
export default interface IModal {
  onHide: () => void;
  show: boolean;
  title: string;
}

// Register

interface userInfo {
  email: string;
  password: string;
  username: string;
  confirmation: string;
}
