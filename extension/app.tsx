import React, { useEffect, useMemo } from "react";
import { useImmerReducer } from "use-immer";

import { AppContext, NoteActionType } from "./common";
import { CreateButton } from "./components/CreateButton";
import { TextArea, TextAreaProps } from "./components/TextArea";

interface NoteAction {
  type: NoteActionType;
  payload: any;
}

const reducer = (draft: TextAreaProps[], action: NoteAction) => {
  const { type, payload } = action;
  switch (type) {
    case NoteActionType.ADD: {
      draft.push({
        id: Date.now(),
        ...payload,
      });
      break;
    }
    case NoteActionType.DELETE: {
      const deleteIndex = draft.findIndex((item) => item.id === payload.id);
      draft.splice(deleteIndex, 1);
      break;
    }
    case NoteActionType.UPDATE: {
      const currentItem = draft.find((item) => item.id === payload.id);
      Object.assign(currentItem, payload);
      break;
    }
    case NoteActionType.UP: {
      const currentItem = draft.find((item) => item.id === payload.id);
      const currentIndex = draft.findIndex((item) => item.id === payload.id);
      if (currentItem) {
        draft.splice(currentIndex, 1);
        draft.push(currentItem);
      }
      break;
    }
    case NoteActionType.INIT: {
      payload.forEach((item) => draft.push(item));
      break;
    }
    default:
      break;
  }
};

function App() {
  const [state, dispatch] = useImmerReducer(reducer, []);

  useEffect(() => {
    chrome.storage.sync
      .get(["notes"])
      .then((result) =>
        dispatch({ type: NoteActionType.INIT, payload: result.notes })
      );
  }, []);

  useEffect(() => {
    chrome.storage.sync.set({ notes: state }).then(() => undefined);
  }, [state]);

  const ContextValue = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return (
    <AppContext.Provider value={ContextValue}>
      <div className="h-full relative">
        <CreateButton />
        {state.map((item) => (
          <TextArea key={item.id} {...item} />
        ))}
      </div>
    </AppContext.Provider>
  );
}

export default App;
