import { getAuthUser, loginUser, mapApiUser } from './api';
import { AuthUser } from './Authontext';

type LoginResponse = {
  token: string;
  user: AuthUser;
};

export async function login(email: string, password: string): Promise<LoginResponse> {
  const { accessToken } = await loginUser(email, password);
  const user = await getAuthUser(accessToken);

  return { token: accessToken, user: mapApiUser(user) };
}
