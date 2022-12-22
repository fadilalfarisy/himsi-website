import CollegeLink from "../model/college-link.js";

const getCollegeLink = async (req, res, next) => {
  try {
    let match = {};
    // category filter
    if (req.query.category) {
      match.category = req.query.category;
    } 
    let response = await CollegeLink.aggregate([
        { $match: match },
    ]);
    res.send(response);

    // res.status(200).json({
    //   status: 200,
    //   message: "success",
    //   data: collegeLink,
    // }); 
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: 500,
      message: "failed",
      info: "There's an error when retrieving college links",
    });
  }
};

const getCollegeLinkById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const collegeLink = await CollegeLink.findOne({ _id: id });
    if (!collegeLink) {
      return res.status(400).json({
        status: 400,
        message: "failed",
        info: "college link not found",
      });
    }
    res.status(200).json({
      status: 200,
      message: "success",
      data: collegeLink,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: 500,
      message: "failed",
      info: "There's an error when retrieving college links with that id",
    });
  }
};

const createCollegeLink = async (req, res, next) => {
  const { name, url, category } = req.body;
  try {
    const newCollegeLink = await CollegeLink.create({
      name,
      url,
      category,
    });
    res.status(200).json({
      status: 200,
      message: "success",
      data: newCollegeLink,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: 500,
      message: "failed",
      info: "server error",
    });
  }
};

const editCollegeLink = async (req, res, next) => {
  const { id } = req.params;
  const { name, url, category } = req.body;
  try {
    const updatedCollegeLink = await CollegeLink.updateOne(
      { _id: id },
      {
        $set: {
          name,
          url,
          category,
        },
      }
    );
    res.status(200).json({
      status: 200,
      message: "success",
      data: updatedCollegeLink,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: 500,
      message: "failed",
      info: "server error",
    });
  }
};

const deleteCollegeLink = async (req, res, next) => {
  const { id } = req.params;
  try {
    const deletedCollegeLink = await CollegeLink.deleteOne({ _id: id });
    if (deletedCollegeLink.deletedCount === 0) {
      return res.status(400).json({
        status: 400,
        message: "failed",
        info: "link not found",
      });
    }
    res.status(200).json({
      status: 200,
      message: "success",
      data: deletedCollegeLink,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: 500,
      message: "failed",
      info: "server error",
    });
  }
};

const collegeLinkController = {
  createCollegeLink,
  getCollegeLink,
  getCollegeLinkById,
  editCollegeLink,
  deleteCollegeLink,
};

export default collegeLinkController;
