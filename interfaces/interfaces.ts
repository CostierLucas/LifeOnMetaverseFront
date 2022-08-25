// Edition
export interface IEdition {
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
  [key: number]: any;
}

export interface IEditionProps {
  editions: IEdition;
}

// Modal
export default interface IModal {
  onHide: () => void;
  show: boolean;
  title: string;
}
