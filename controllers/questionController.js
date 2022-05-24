const questionSchema = require("../models/questionSchema");
const ulwSchema = require("../models/ulwSchema");

async function getQuestionController(req, res) {
  let { quesId } = req.params;
  try {
    const data = await questionSchema.find({ id: quesId });
    res.json({ msg: "success", question: data });
  } catch (error) {
    console.log(error);
  }
  console.log(req.params);
  res.send("hello");
}

// When a user try to click liked,watchlater it will create a new record in the table
function addRecordController(req, res) {
  let { userId, questionId } = req.body;
  ulwSchema
    .findOne({ questionId })
    .then((question) => {
      if (question) {
        return res
          .status(202)
          .send({ msg: "Question already added", question: question });
      } else {
        const newUserQuestion = new ulwSchema({
          userId,
          questionId,
        });

        newUserQuestion
          .save()
          .then((question) => res.send(question))
          .catch((err) => console.log(err));
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

function userLikedQuestionController(req, res, next) {
  let { id, userId, questionId, isLiked, isWatchLater } = req.body;
  console.log("1", req.body);
  const updateQuestion = new ulwSchema({
    _id: id,
    liked: isLiked,
    watchLater: isWatchLater ? true : false,
  });

  ulwSchema
    .updateOne({ _id: id, questionId, userId }, updateQuestion)
    .then((quest) => {
      console.log(quest);
      res.status(201).json({ success: true, msg: "Updated Successfull" });
    })
    .catch((err) => {
      res.json({ success: false, msg: "Please login first,then try again" });
    });
}

async function getUserQuestionController(req, res) {
  try {
    const { userId } = req.params;
    const data = await ulwSchema.find({ userId });
    res.status(200).json({ questions: data });
  } catch (error) {
    res.status(400).json({ msg: "Not Authorized", success: false });
  }
}

async function getUserLikedQuestionController(req, res) {
  try {
    const { id } = req.params;
    const data = await ulwSchema.findOne({ _id: id });
    res.status(200).json({ question: data });
  } catch (error) {
    console.log(error.message);
    res.status(404).json({ msg: "Data not found", success: false });
  }
}

module.exports = {
  getQuestionController,
  addRecordController,
  userLikedQuestionController,
  getUserQuestionController,
  getUserLikedQuestionController,
};
