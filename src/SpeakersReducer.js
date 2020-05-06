const SpeakersReducer = (state, action) => {
  const updateFavorite = favoriteValue => {
    const { speakerList } = state;
    const formattedSpeakersList = speakerList.map(item => {
      if (item.id === action.payload) {
        item.favorite = favoriteValue;
        return item;
      }
      return item;
    });
    return {
      speakerList: formattedSpeakersList
    };
  };
  switch (action.type) {
    case "SET_SPEAKERS_LIST":
      return action.payload;
    case "FAVORITE":
      return updateFavorite(true);
    case "UN_FAVORITE":
      return updateFavorite(false);
    default:
      return state;
  }
};

export default SpeakersReducer;
