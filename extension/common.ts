import React from "react";

export const AppContext = React.createContext(undefined);

export const enum NoteActionType {
  ADD = "ADD",
  DELETE = "DELETE",
  UPDATE = "UPDATE",
  UP = "UP",
  INIT = "INIT",
}

export const enum ItemTypes {
  CARD = "card",
}
