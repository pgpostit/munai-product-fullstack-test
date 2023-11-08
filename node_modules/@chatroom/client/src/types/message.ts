export interface Message {
  id: string;
  text: string;
  authorId: string;
  author: {
    username: string;
  };
  createdAt: string;
}
