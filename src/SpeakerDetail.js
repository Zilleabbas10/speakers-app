import React, { useContext } from "react";
import ImageToggleOnScroll from "./ImageToggleOnScroll";
import { ConfigContext } from "./App";

const SpeakerDetail = React.memo(
  ({
    id,
    firstName,
    lastName,
    favorite,
    sat,
    sun,
    bio,
    onHeartFavoriteHandler
  }) => {
    const context = useContext(ConfigContext);
    const { loggedInUserEmail } = context;
    console.log(`SpeakerDetail:${id} ${firstName} ${lastName} ${favorite}`);
    return (
      <div className="card col-4 cardmin">
        <ImageToggleOnScroll
          className="card-img-top"
          primaryImg={`/static/speakers/bw/Speaker-${id}.jpg`}
          secondaryImg={`/static/speakers/Speaker-${id}.jpg`}
          alt="{firstName} {lastName}"
        />
        <div className="card-body">
          <h4 className="card-title">
            {loggedInUserEmail ? (
              <button
                data-sessionid={id}
                className={favorite ? "heartredbutton" : "heartdarkbutton"}
                onClick={e => {
                  onHeartFavoriteHandler(e, {
                    id,
                    firstName,
                    lastName,
                    favorite,
                    sat,
                    sun,
                    bio
                  });
                }}
              />
            ) : null}
            <span>
              {firstName} {lastName}
            </span>
          </h4>

          <span>{bio}</span>
        </div>
      </div>
    );
  }
);

export default SpeakerDetail;
