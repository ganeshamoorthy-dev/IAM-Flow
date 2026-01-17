import { createContext } from "react";
import type { UserResponse } from "../models/response/UserResponse";

export const CurrentUserContext = createContext<UserResponse | null>(null);
