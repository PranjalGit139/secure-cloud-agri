import AWS from "aws-sdk";

const cognito = new AWS.CognitoIdentityServiceProvider({ region: process.env.AWS_REGION });

export const registerUser = async (req, res) => {
  const { email, password, name, role } = req.body;
  try {
    const createUser = await cognito.adminCreateUser({
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      Username: email,
      UserAttributes: [
        { Name: "email", Value: email },
        { Name: "name", Value: name },
        { Name: "email_verified", Value: "true" },
      ],
      TemporaryPassword: password,
      MessageAction: "SUPPRESS",
    }).promise();

    await cognito.adminSetUserPassword({
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      Username: email,
      Password: password,
      Permanent: true,
    }).promise();

    await cognito.adminAddUserToGroup({
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      Username: email,
      GroupName: role,
    }).promise();

    res.status(200).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
};
