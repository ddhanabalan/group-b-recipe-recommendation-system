import React, { createContext } from "react";
import { useState } from "react";

const all_reviews = [
  {
    id: 1,
    ratings: 5,
    review:
      "This recipe was delicious! Instead of cherry pie filling - I used fresh picked cherries (pitted), tossed with cinnamon, corn starch, and sugar. For dough, I didn't have white whole wheat flout, ...",
    user_id: 3419993,
    username: "Pie84",
    date: "11-09-2012",
  },
  {
    id: 2,
    ratings: 5,
    review:
      "Made this recipe as instructed and it was easy and delicious.Needed a quick dessert for Christmas Day so made again using what ingredients I had on hand.Frozen pie crust dough and canned blu...",
    user_id: 3154459,
    username: "hertzen",
    date: "31-12-2016",
  },
  {
    id: 3,
    ratings: 3,
    review:
      "This was very delicious. The crust reminded me of making scones. I filled it with a can of sweet cherries. (Cherries only, no added ingredients). Next time, I would use two, to be about the same...",
    user_id: 2715707,
    username: "Sarahtea",
    date: "07-07-2015",
  },
  {
    id: 4,
    ratings: 5,
    review:
      "Great recipe. Easy to make but looks impressive. I made it exactly as it is written. Not too sweet or tart. Thank Chef John.",
    user_id: 9115416,
    username: "Kari BO'B",
    date: "22-02-2016",
  },
  {
    id: 1,
    ratings: 4.5,
    review:
      "Great recipe. Easy to make but looks impressive. I made it exactly as it is written. Not too sweet or tart. Thank Chef John.",
    user_id: 9115416,
    username: "Kari BO'B",
    date: "22-02-2016",
  },
  {
    id: 5,
    ratings: 5,
    review:
      "Great recipe. Easy to make but looks impressive. I made it exactly as it is written. Not too sweet or tart. Thank Chef John.",
    user_id: 9115416,
    username: "Kari BO'B",
    date: "22-02-2016",
  },
  {
    id: 5,
    ratings: 3,
    review:
      "Great recipe. Easy to make but looks impressive. I made it exactly as it is written. Not too sweet or tart. Thank Chef John.",
    user_id: 9115416,
    username: "Kari BO'B",
    date: "22-02-2016",
  },
];

const UserReviewContext = createContext();

const UserReviewContextProvider = ({ children }) => {
  const [value, setValue] = useState(all_reviews);
  return (
    <UserReviewContext.Provider value={{ value, setValue }}>
      {children}
    </UserReviewContext.Provider>
  );
};

export { UserReviewContext, UserReviewContextProvider };
