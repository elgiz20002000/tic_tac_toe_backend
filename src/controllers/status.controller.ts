import type { NextFunction, Request, Response } from "express";

import type { IResponseError } from "../interfaces.ts";
import * as statusService from "../services/status.service.ts";

export const changeStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body;

    if (!status) {
      const err = new Error("Status is required") as IResponseError;
      err.status = 400;
      throw err;
    }

    await statusService.changeStatus(status, req.user?.id || "");

    res.status(200).json({ message: "Status changed successfully" });
  } catch (error) {
    next(error);
  }
};
