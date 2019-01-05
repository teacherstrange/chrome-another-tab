import React, { FC } from "react";
import styled, { keyframes } from "styled-components/macro";
import { isEmpty } from "lodash";
import { BookmarkList } from "./BookmarkList";
import { useOnMount } from "../hooks/useOnMount";
import { actions } from "../actions";
import { Header } from "./Header";
import { ReduxState } from "../types/ReduxState";
import { useMappedState } from "redux-react-hook";
import { useMappedActions } from "../hooks/useMappedActions";
import { getBookmarkTree } from "../selectors/getBookmarkTree";
import { NoResult } from "./NoResult";

const mapState = (state: ReduxState) => ({
  bookmarkTree: getBookmarkTree(state),
  areBookmarksReady: state.session.areBookmarksReady
});

const mapActions = {
  rehydrate: actions.rehydrate,
  retrieveBookmarks: actions.retrieveBookmarks
};

export const App: FC = () => {
  const { areBookmarksReady, bookmarkTree } = useMappedState(mapState);
  const { retrieveBookmarks, rehydrate } = useMappedActions(mapActions);

  const isBookmarkTreeEmpty = isEmpty(bookmarkTree);

  useOnMount(() => {
    rehydrate();
    retrieveBookmarks();
  });

  return (
    <Root>
      {areBookmarksReady && (
        <>
          <Header />
          {!isBookmarkTreeEmpty && (
            <Main>
              <BookmarkList bookmarkTree={bookmarkTree} />
            </Main>
          )}
          {isBookmarkTreeEmpty && <NoResult />}
        </>
      )}
    </Root>
  );
};

const fadeIn = keyframes`
  from { opacity: 0;}
  to { opacity: 1; }
`;

const Root = styled.div`
  animation: ${fadeIn} 0.1s ease-in-out both;
  text-align: center;
  transition: all 0.6s ease-out;
  height: 100%;
  min-height: 100vh;
  overflow: hidden; // added for pseudo-element
  position: relative; // added for pseudo-element

  &::before {
    content: "";
    position: fixed;
    width: 100%;
    height: 100vh;
    top: 0;
    left: 0;
    will-change: transform;
    z-index: -1;
    background: linear-gradient(to bottom, #7474bf, #348ac7);
  }
`;

const Main = styled.main`
  animation: ${fadeIn} 0.3s ease-in-out both;
  animation-delay: 0.1s;
  padding: 0 40px;
`;
