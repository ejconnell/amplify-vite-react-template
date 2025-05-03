export interface IShape {
  name: string;
  hasInnerWidth: boolean;
  chinese: string;
  abbreviation: string;
  widthLabel: string;
  chineseWidth: string;
  area: (width: number, innerWidth: number) => number;
}

export const Shapes: IShape[] = [
  {
    name: "Cylindrical",
    hasInnerWidth: false,
    chinese: "圓柱",
    abbreviation: "",
    widthLabel: "Diameter",
    chineseWidth: "直徑",
    area: (width: number, _: number) => Math.PI * width * width / 4,
  },
  {
    name: "Hollow Cylindrical",
    hasInnerWidth: true,
    chinese: "圓管",
    abbreviation: "",
    widthLabel: "Diameter",
    chineseWidth: "直徑",
    area: (width: number, innerWidth: number) => (Math.PI * width * width / 4) - (Math.PI * innerWidth * innerWidth / 4),
  },
  {
    name: "Square",
    hasInnerWidth: false,
    chinese: "四角",
    abbreviation: "四角",
    widthLabel: "Side",
    chineseWidth: "角",
    area: (width: number, _: number) => width * width,
  },
  {
    name: "Hollow Square",
    hasInnerWidth: true,
    chinese: "空心四角",
    abbreviation: "四角",
    widthLabel: "Side",
    chineseWidth: "角",
    area: (width: number, innerWidth: number) => (width * width) - (innerWidth * innerWidth),
  },
  {
    name: "Hexagonal",
    hasInnerWidth: false,
    chinese: "六角",
    abbreviation: "六角",
    widthLabel: "Side",
    chineseWidth: "角",
    area: (width: number, _: number) => Math.sqrt(3) / 2 * width * width,
  },
];