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

export enum Controls {
  previous = 'previous',
  next = 'next',
  escape = 'escape'
}
