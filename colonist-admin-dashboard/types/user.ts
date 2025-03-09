export interface User {
  id: string;
  userName: string;
  country: string;
  createdAt: string;
} 
export interface UserNote {
  userId: string;
  note: string;
}