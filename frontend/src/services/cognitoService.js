import { Auth } from "aws-amplify";

Auth.configure({
  region: "us-east-1",
  userPoolId: "us-east-1_145jCHH5M",
  userPoolWebClientId: "5hhupll2kbkd0pn2hjqjr8dvs8", // no secret
});


export const login = async (email, password) => {
  const user = await Auth.signIn(email, password);
  return user.signInUserSession.idToken.jwtToken;
};
