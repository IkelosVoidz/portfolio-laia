export interface BookContent {
  title: string;
  date: string;
  technique: string;
  size: string;
  imagePath: string;
}

export interface Book {
  title: string;
  content: BookContent[];
}
