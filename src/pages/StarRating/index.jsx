import React, { useState } from "react";
import { StarRatings } from "../../Components";

const StarRatingPage = () => {
  const [rating, setRating] = useState(3);

  const changeRating = (newRating) => {
    setRating(newRating);
  };

  return (
    <div className="demoBox">
      <h3>星级评价</h3>
      <StarRatings
        rating={rating}
        starRatedColor="red"
        changeRating={changeRating}
        numberOfStars={6}
        name="rating"
      />
    </div>
  );
};

export default StarRatingPage;
