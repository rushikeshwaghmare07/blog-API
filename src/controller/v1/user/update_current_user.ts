import { logger } from "@/lib/winston";

import User from "@/models/user";

import type { Request, Response } from "express";

const updateCurrentUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.userId;
  const {
    username,
    email,
    password,
    first_name,
    last_name,
    website,
    linkedin,
    facebook,
    youtube,
    instagram,
    x,
  } = req.body;

  try {
    const user = await User.findById(userId).select("+password").exec();

    if (!user) {
      res.status(404).json({
        code: "NotFound",
        message: "User not found",
      });
      return;
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (password) user.password = password;
    if (first_name) user.firstName = first_name;
    if (last_name) user.lastName = last_name;
    if (!user.socialLinks) {
      user.socialLinks = {};
    }
    if (website) user.socialLinks.website = website;
    if (linkedin) user.socialLinks.linkedin = linkedin;
    if (facebook) user.socialLinks.facebook = facebook;
    if (youtube) user.socialLinks.youtube = youtube;
    if (instagram) user.socialLinks.instagram = instagram;
    if (x) user.socialLinks.x = x;

    await user.save();
    logger.info("User updated successfully", user);

    res.status(200).json({
      user,
    });
  } catch (error) {
    res.status(500).json({
      code: "ServerError",
      message: "Internal server error",
      error: error,
    });

    logger.error("Error while updating current user", error);
  }
};

export default updateCurrentUser;
