import type { NextFunction, Request, Response } from "express";

import type { IResponseError } from "../interfaces.ts";
import * as commonInfoService from "../services/commonInfo.service.ts";

export const getMainPage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const mainPageInfo = await commonInfoService.getMainPageInfo(req.user?.id || "");
    res.json(mainPageInfo);
  } catch (error) {
    next(error);
  }
};

export const getGameHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { dateFrom, dateTo } = req.query;
    const userId = req.user?.id;

    const gameHistories = await commonInfoService.getGameHistory(
      userId,
      dateFrom as string | undefined,
      dateTo as string | undefined,
    );

    res.status(200).json(gameHistories);
  } catch (error) {
    next(error);
  }
};

export const getScoreboard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { searchText } = req.query;
    const scoreboardData = await commonInfoService.getScoreboard(searchText as string | undefined);
    res.status(200).json(scoreboardData);
  } catch (error) {
    next(error);
  }
};

export const getOnlinePlayers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      const err = new Error("Unauthorized") as IResponseError;
      err.status = 401;
      throw err;
    }
    const searchText = typeof req.query.search === "string" ? req.query.search : undefined;
    const players = await commonInfoService.getOnlinePlayers(userId, searchText);
    res.status(200).json(players);
  } catch (error) {
    next(error);
  }
};
