import * as React from "react";
import { useFragment, useMutation } from "react-relay";
import { RecordSourceSelectorProxy, graphql } from "relay-runtime";

import type { StoryLikeButtonFragment$key } from "./__generated__/StoryLikeButtonFragment.graphql";

type Props = {
  story: StoryLikeButtonFragment$key;
};

const StoryLikeButtonFragment = graphql`
  fragment StoryLikeButtonFragment on Story {
    id
    likeCount
    doesViewerLike
  }
`;

const StoryLikeButtonLikeMutation = graphql`
  mutation StoryLikeButtonLikeMutation($id: ID!, $doesLike: Boolean!) {
    likeStory(id: $id, doesLike: $doesLike) {
      story {
        ...StoryLikeButtonFragment
      }
    }
  }
`;

export default function StoryLikeButton({ story }: Props): React.ReactElement {
  const data = useFragment<StoryLikeButtonFragment$key>(
    StoryLikeButtonFragment,
    story
  );
  const [commitMutation, isMutationInFlight] = useMutation(
    StoryLikeButtonLikeMutation
  );
  function onLikeButtonClicked() {
    commitMutation({
      variables: {
        id: data.id,
        doesLike: !data.doesViewerLike,
      },
      optimisticUpdater: (store: RecordSourceSelectorProxy) => {
        const newDoesLike = !data.doesViewerLike;
        const storyRecord = store.get(data.id);
        if (storyRecord) {
          const currentLikeCount = storyRecord.getValue("likeCount");
          if (typeof currentLikeCount === "number") {
            storyRecord.setValue(
              newDoesLike ? currentLikeCount + 1 : currentLikeCount - 1,
              "likeCount"
            );
          }
          storyRecord.setValue(newDoesLike, "doesViewerLike");
        }
      },
    });
  }
  return (
    <div className="likeButton">
      <LikeCount count={data.likeCount} />
      <LikeButton
        doesViewerLike={data.doesViewerLike}
        onClick={onLikeButtonClicked}
      />
    </div>
  );
}

function LikeCount({ count }: { count: number }) {
  return <div className="likeButton__count">{count} likes</div>;
}

function LikeButton({
  doesViewerLike,
  onClick,
  disabled,
}: {
  doesViewerLike: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      className="likeButton__button"
      onClick={onClick}
      disabled={disabled}
    >
      <span
        className={
          doesViewerLike
            ? "likeButton__thumb__viewerLikes"
            : "likeButton__thumb__viewerDoesNotLike"
        }
      >
        👍
      </span>{" "}
      <span
        className={
          doesViewerLike
            ? "likeButton__label__viewerLikes"
            : "likeButton__label__viewerDoesNotLike"
        }
      >
        Like
      </span>
    </button>
  );
}
