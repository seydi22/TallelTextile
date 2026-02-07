const express = require("express");
const router = express.Router();

const {
  getSetting,
  getAllSettings,
  upsertSetting,
  deleteSetting,
} = require("../controllers/settings");

router.route("/").get(getAllSettings).post(upsertSetting);

router
  .route("/:key")
  .get(getSetting)
  .put(upsertSetting)
  .delete(deleteSetting);

module.exports = router;
