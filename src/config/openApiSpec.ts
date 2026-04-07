/**
 * OpenAPI 3 document for REST endpoints. Socket.IO is not included here.
 */
const errorContent = {
  "application/json": {
    schema: {
      type: "object",
      properties: {
        error: { type: "string" },
      },
    },
  },
};

export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Tic Tac Toe API",
    version: "1.0.0",
    description:
      "HTTP API for the tic tac toe backend. Use **Authorize** and paste a JWT from OAuth callback for protected routes.",
  },
  servers: [{ url: "/", description: "Current server" }],
  tags: [
    { name: "Auth", description: "OAuth2 browser redirects" },
    { name: "Common info", description: "Dashboard, history, scoreboard, players" },
    { name: "Status", description: "Online player status" },
    { name: "Friendship", description: "Friend requests and friends list" },
  ],
  paths: {
    "/auth/facebook": {
      get: {
        tags: ["Auth"],
        summary: "Start Facebook OAuth",
        description: "Redirects the browser to Facebook login.",
        responses: {
          "302": { description: "Redirect to Facebook" },
        },
      },
    },
    "/auth/facebook/callback": {
      get: {
        tags: ["Auth"],
        summary: "Facebook OAuth callback",
        description: "Completes login and redirects to `state` with `?token=<jwt>`.",
        responses: {
          "302": { description: "Redirect to client with token" },
          "401": { description: "User not found", content: errorContent },
        },
      },
    },
    "/auth/google": {
      get: {
        tags: ["Auth"],
        summary: "Start Google OAuth",
        description: "Redirects the browser to Google login.",
        responses: {
          "302": { description: "Redirect to Google" },
        },
      },
    },
    "/auth/google/callback": {
      get: {
        tags: ["Auth"],
        summary: "Google OAuth callback",
        description: "Completes login and redirects to `state` with `?token=<jwt>`.",
        responses: {
          "302": { description: "Redirect to client with token" },
          "401": { description: "User not found", content: errorContent },
        },
      },
    },
    "/commonInfo/main-page": {
      get: {
        tags: ["Common info"],
        summary: "Main page payload",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Wins, losses, draws, recent game history, top scoreboard slice",
            content: {
              "application/json": { schema: { type: "object", additionalProperties: true } },
            },
          },
          "401": { description: "Missing or invalid token", content: errorContent },
        },
      },
    },
    "/commonInfo/game-history": {
      get: {
        tags: ["Common info"],
        summary: "Game history",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "dateFrom",
            in: "query",
            required: false,
            schema: { type: "string", format: "date-time" },
            description: "Filter lower bound (passed through to service)",
          },
          {
            name: "dateTo",
            in: "query",
            required: false,
            schema: { type: "string", format: "date-time" },
            description: "Filter upper bound (passed through to service)",
          },
        ],
        responses: {
          "200": {
            description: "List of game history rows",
            content: {
              "application/json": {
                schema: { type: "array", items: { type: "object", additionalProperties: true } },
              },
            },
          },
          "400": { description: "Validation error", content: errorContent },
          "401": { description: "Missing or invalid token", content: errorContent },
        },
      },
    },
    "/commonInfo/scoreboard": {
      get: {
        tags: ["Common info"],
        summary: "Scoreboard",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "searchText",
            in: "query",
            required: false,
            schema: { type: "string", minLength: 1, maxLength: 50 },
          },
        ],
        responses: {
          "200": {
            description: "Scoreboard rows",
            content: {
              "application/json": {
                schema: { type: "array", items: { type: "object", additionalProperties: true } },
              },
            },
          },
          "400": { description: "Validation error", content: errorContent },
          "401": { description: "Missing or invalid token", content: errorContent },
        },
      },
    },
    "/commonInfo/online-players": {
      get: {
        tags: ["Common info"],
        summary: "Online players",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "search",
            in: "query",
            required: false,
            schema: { type: "string" },
            description: "Optional filter on player name (case-insensitive contains)",
          },
        ],
        responses: {
          "200": {
            description: "Online player list",
            content: {
              "application/json": {
                schema: { type: "array", items: { type: "object", additionalProperties: true } },
              },
            },
          },
          "401": { description: "Missing or invalid token", content: errorContent },
        },
      },
    },
    "/status/change-status": {
      post: {
        tags: ["Status"],
        summary: "Change current online status",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["status"],
                properties: {
                  status: { type: "string", enum: ["Online", "Offline", "Playing"] },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Status updated",
            content: {
              "application/json": {
                schema: { type: "object", properties: { message: { type: "string" } } },
              },
            },
          },
          "400": { description: "Bad request or validation", content: errorContent },
          "401": { description: "Missing or invalid token", content: errorContent },
        },
      },
    },
    "/friendship/send-friendship": {
      post: {
        tags: ["Friendship"],
        summary: "Send friendship request",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["playerId"],
                properties: { playerId: { type: "string", format: "uuid" } },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Request sent",
            content: {
              "application/json": {
                schema: { type: "object", properties: { message: { type: "string" } } },
              },
            },
          },
          "401": { description: "Missing or invalid token", content: errorContent },
        },
      },
    },
    "/friendship/accept-friendship": {
      post: {
        tags: ["Friendship"],
        summary: "Accept friendship request",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["requestId"],
                properties: { requestId: { type: "string", format: "uuid" } },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Request accepted",
            content: {
              "application/json": {
                schema: { type: "object", properties: { message: { type: "string" } } },
              },
            },
          },
          "401": { description: "Missing or invalid token", content: errorContent },
        },
      },
    },
    "/friendship/reject-friendship": {
      post: {
        tags: ["Friendship"],
        summary: "Reject friendship request",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["requestId"],
                properties: { requestId: { type: "string", format: "uuid" } },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Request rejected",
            content: {
              "application/json": {
                schema: { type: "object", properties: { message: { type: "string" } } },
              },
            },
          },
          "401": { description: "Missing or invalid token", content: errorContent },
        },
      },
    },
    "/friendship/get-all-friendship-requests": {
      get: {
        tags: ["Friendship"],
        summary: "List friendship requests for current user",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Friendship requests",
            content: {
              "application/json": {
                schema: { type: "array", items: { type: "object", additionalProperties: true } },
              },
            },
          },
          "401": { description: "Missing or invalid token", content: errorContent },
        },
      },
    },
    "/friendship/get-all-friends": {
      get: {
        tags: ["Friendship"],
        summary: "List friends for current user",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Friends",
            content: {
              "application/json": {
                schema: { type: "array", items: { type: "object", additionalProperties: true } },
              },
            },
          },
          "401": { description: "Missing or invalid token", content: errorContent },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "JWT from OAuth callback query `token`",
      },
    },
  },
} as const;
