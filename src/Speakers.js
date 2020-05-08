import React, {
  useState,
  useEffect,
  useContext,
  useReducer,
  useCallback,
  useMemo
} from "react";
import axios from "axios";

import "bootstrap/dist/css/bootstrap.min.css";
import "../static/site.css";
import { Header } from "../src/Header";
import { Menu } from "../src/Menu";
import SpeakerData from "./SpeakerData";
import SpeakerDetail from "./SpeakerDetail";
import { ConfigContext } from "./App";
import SpeakersReducer from "./SpeakersReducer";
import useAxiosFetch from "./useAxiosFetch";

const Speakers = ({}) => {
  const {
    data,
    isLoading,
    hasErrored,
    errorMessage,
    updateDataRecord
  } = useAxiosFetch("http://localhost:4000/speakers", []);

  const [speakingSaturday, setSpeakingSaturday] = useState(true);
  const [speakingSunday, setSpeakingSunday] = useState(true);

  //const [speakerList, setSpeakerList] = useState([]);
  const initialState = {
    speakerList: []
  };

  // const [state, dispatch] = useReducer(SpeakersReducer, initialState);
  // const { speakerList = [] } = state;

  // const [isLoading, setIsLoading] = useState(true);

  const context = useContext(ConfigContext);
  const { showSpeakerSpeakingDays } = context;

  // useEffect(() => {
  //   setIsLoading(true);
  //   new Promise(function(resolve) {
  //     setTimeout(function() {
  //       resolve();
  //     }, 1000);
  //   }).then(() => {
  //     setIsLoading(false);
  //     const speakerListServerFilter = SpeakerData.filter(({ sat, sun }) => {
  //       return (speakingSaturday && sat) || (speakingSunday && sun);
  //     });
  //     dispatch({
  //       type: "SET_SPEAKERS_LIST",
  //       payload: {
  //         speakerList: speakerListServerFilter
  //       }
  //     });
  //     //setSpeakerList(speakerListServerFilter);
  //   });
  //   return () => {
  //     console.log("cleanup");
  //   };
  // }, []); // [speakingSunday, speakingSaturday]);

  const handleChangeSaturday = () => {
    setSpeakingSaturday(!speakingSaturday);
  };

  const newSpeakersList = useMemo(
    () =>
      data
        .filter(
          ({ sat, sun }) => (speakingSaturday && sat) || (speakingSunday && sun)
        )
        .sort((a, b) => {
          if (a.firstName < b.firstName) {
            return -1;
          }
          if (a.firstName > b.firstName) {
            return 1;
          }
          return 0;
        }),
    [speakingSunday, speakingSaturday, data]
  );

  const speakerListFiltered = isLoading ? [] : newSpeakersList;

  const handleChangeSunday = () => {
    setSpeakingSunday(!speakingSunday);
  };

  const heartFavoriteHandler = useCallback((e, speakerRec) => {
    e.preventDefault();
    const toggledRec = { ...speakerRec, favorite: !speakerRec.favorite };
    axios
      .put(`http://localhost:4000/speakers/${speakerRec.id}`, toggledRec)
      .then(response => {
        updateDataRecord(toggledRec);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  if (hasErrored)
    return (
      <div>
        {errorMessage}&nbsp;"Make sure you have launched "npm run json-server"
      </div>
    );

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <Header />
      <Menu />
      <div className="container">
        <div className="btn-toolbar  margintopbottom5 checkbox-bigger">
          {showSpeakerSpeakingDays ? (
            <div className="hide">
              <div className="form-check-inline">
                <label className="form-check-label">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    onChange={handleChangeSaturday}
                    checked={speakingSaturday}
                  />
                  Saturday Speakers
                </label>
              </div>
              <div className="form-check-inline">
                <label className="form-check-label">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    onChange={handleChangeSunday}
                    checked={speakingSunday}
                  />
                  Sunday Speakers
                </label>
              </div>
            </div>
          ) : null}
        </div>
        <div className="row">
          <div className="card-deck">
            {speakerListFiltered.map(
              ({ id, firstName, lastName, sat, sun, bio, favorite }) => {
                return (
                  <SpeakerDetail
                    key={id}
                    id={id}
                    favorite={favorite}
                    onHeartFavoriteHandler={heartFavoriteHandler}
                    firstName={firstName}
                    lastName={lastName}
                    bio={bio}
                    sat={sat}
                    sun={sun}
                  />
                );
              }
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Speakers;
