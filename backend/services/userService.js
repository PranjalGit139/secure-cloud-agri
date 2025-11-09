// userService.js
import AWS from "aws-sdk";

const cognito = new AWS.CognitoIdentityServiceProvider({ region: process.env.AWS_REGION });

export const getAllFarmers = async () => {
  const params = {
    UserPoolId: process.env.COGNITO_USER_POOL_ID,
    GroupName: "farmer", 
  };
  console.log("Fetching users with params:", params);


  const result = await cognito.listUsersInGroup(params).promise();
  console.log("Cognito response:", JSON.stringify(result, null, 2));

  return result.Users.map(user => ({
    username: user.Username,
    email: user.Attributes.find(attr => attr.Name === "email")?.Value,
    name: user.Attributes.find(attr => attr.Name === "name")?.Value || "N/A",
  }));
};

export const getAllUsers = async () => {
  const params = {
    UserPoolId: process.env.COGNITO_USER_POOL_ID,
  };

  const result = await cognito.listUsers(params).promise();

  return result.Users.map(user => ({
    username: user.Username,
    email: user.Attributes.find(attr => attr.Name === "email")?.Value,
    name: user.Attributes.find(attr => attr.Name === "name")?.Value || "N/A",
    groups: user.Attributes.find(attr => attr.Name === "custom:role")?.Value || "N/A",
  }));
};

export const deleteUser = async (username) => {
  const params = {
    UserPoolId: process.env.COGNITO_USER_POOL_ID,
    Username: username,
  };
  await cognito.adminDeleteUser(params).promise();
  return { message: "User deleted successfully" };
};

