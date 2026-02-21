import type { NextFunction, Request, Response } from "express";

import { EStatusMessages } from "../enums.ts";
import type { IResponseError } from "../interfaces.ts";
import * as authService from "../services/auth.service.ts";

export const loginCallback = async (req: Request, res: Response, next: NextFunction) => {
  console.log("req.user", req.user);
  const user = req.user;

  if (!user?.id) {
    const err = new Error(EStatusMessages.UserNotFound) as IResponseError;
    err.status = 401;
    return next(err);
  }

  try {
    const token = await authService.loginCallback(user);
    const redirect = req.query.state;

    res.redirect(`${redirect}?token=${token}`);
  } catch (err) {
    next(err);
  }
};
