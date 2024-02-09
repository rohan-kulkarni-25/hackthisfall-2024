import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { APIError } from "../utils/APIError.js";
import { APIResponse } from "../utils/APIResponse.js";
import { Creator } from "../models/creators.model.js";

const generateAccessAndRefereshTokens = async (creatorId) => {
  try {
    const creator = await Creator.findById(creatorId);
    const accessToken = creator.generateAccessToken();
    const refreshToken = creator.generateRefreshToken();

    creator.refreshToken = refreshToken;
    await creator.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new APIError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};

const registerCreator = asyncHandler(async (req, res) => {
  const { fullName, email, password, isCollaborator, socials } = req.body;

  if ([fullName, email, password].some((field) => field?.trim() === "")) {
    throw new APIError(400, "All fields are required");
  }

  const existedUser = await Creator.findOne({
    $or: [{ email }],
  });

  if (existedUser) {
    throw new APIError(409, "Creator with email already exists");
  }

  // const avatarLocalPath = req.files?.avatar[0]?.path;

  // if (!avatarLocalPath) {
  //   throw new APIError(400, "Avatar file is required");
  // }

  // const avatar = await uploadOnCloudinary(avatarLocalPath);
  // console.log(avatar);
  // if (!avatar) {
  //   throw new APIError(400, "Avatar file is required");
  // }

  const creator = await Creator.create({
    fullName,
    // avatar: avatar.url,
    email,
    password,
    isCollaborator,
    socials,
  });

  const createdUser = await Creator.findById(creator._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new APIError(
      500,
      "Something went wrong while registering the Creator"
    );
  }

  return res
    .status(201)
    .json(new APIResponse(200, createdUser, "Creator registered Successfully"));
});

const loginCreator = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    throw new APIError(400, "Email is required !!");
  }

  const creator = await Creator.findOne({
    $or: [{ email }],
  });

  if (!creator) {
    throw new APIError(404, "Creator does not exist");
  }

  const isPasswordValid = await creator.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new APIError(401, "Invalid Creator credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    creator._id
  );

  const loggedInUser = await Creator.findById(creator._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new APIResponse(
        200,
        {
          Creator: loggedInUser,
          accessToken,
          refreshToken,
        },
        "Creator logged In Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await Creator.findByIdAndUpdate(
    req.creator._id,
    {
      $unset: {
        refreshToken: 1, // this removes the field from document
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "Creator logged Out"));
});

// const refreshAccessToken = asyncHandler(async (req, res) => {
//   const incomingRefreshToken =
//     req.cookies.refreshToken || req.body.refreshToken;

//   if (!incomingRefreshToken) {
//     throw new ApiError(401, "unauthorized request");
//   }

//   try {
//     const decodedToken = jwt.verify(
//       incomingRefreshToken,
//       process.env.REFRESH_TOKEN_SECRET
//     );

//     const Creator = await Creator.findById(decodedToken?._id);

//     if (!Creator) {
//       throw new ApiError(401, "Invalid refresh token");
//     }

//     if (incomingRefreshToken !== Creator?.refreshToken) {
//       throw new ApiError(401, "Refresh token is expired or used");
//     }

//     const options = {
//       httpOnly: true,
//       secure: true,
//     };

//     const { accessToken, newRefreshToken } =
//       await generateAccessAndRefereshTokens(Creator._id);

//     return res
//       .status(200)
//       .cookie("accessToken", accessToken, options)
//       .cookie("refreshToken", newRefreshToken, options)
//       .json(
//         new ApiResponse(
//           200,
//           { accessToken, refreshToken: newRefreshToken },
//           "Access token refreshed"
//         )
//       );
//   } catch (error) {
//     throw new ApiError(401, error?.message || "Invalid refresh token");
//   }
// });

export { registerCreator, loginCreator, logoutUser };
