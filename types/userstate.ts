type User = {
  id: string;
  email: string;
  name: string;
  profile_pic: string | null;
  createdAt: string;
  updatedAt: string;
};

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string|null;

}

export type { UserState, User };