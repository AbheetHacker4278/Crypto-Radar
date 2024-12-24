export interface NewsArticle {
    id: string;
    published_on: number;
    title: string;
    url: string;
    imageurl: string;
    source: string;
    body: string;
    tags: string;
    categories: string;
  }
  
  export interface NewsResponse {
    Data: NewsArticle[];
    Type: number;
    Message: string;
  }