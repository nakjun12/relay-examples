import * as React from "react";
import RelayEnvironment from "../relay/RelayEnvironment";
import LoadingSpinner from "./LoadingSpinner";
import Newsfeed from "./Newsfeed";
import Sidebar from "./Sidebar";
export default function App(): React.ReactElement {
  return (
    <RelayEnvironment>
      <React.Suspense fallback={<LoadingSpinner />}>
        <div className="app">
          <Newsfeed />\
          <Sidebar />
        </div>
      </React.Suspense>
    </RelayEnvironment>
  );
}
