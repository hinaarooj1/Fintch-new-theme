let express = require("express");
const {
  RegisterUser,
  loginUser,
  logoutUser,
  resetPassword,
  allUser,
  singleUser,
  updateSingleUser,
  verifySingleUser,
  getsignUser,
  verifyToken,
  updateKyc,
  sendTicket,
  getHtmlData,
  setHtmlData,
  bypassSingleUser,
  sendEmailCode,
  createAccount,
  deletePayment,
  addCard,
  updateSingleUserStatus,
  createTicket,
  updateMessage,
  adminUpdateTicket,
  adminTickets,
  getUserTickets, getIndivTicket
} = require("../controllers/userController");
const { authorizedRoles, } = require("../middlewares/auth");
const singleUpload = require("../middlewares/multer");

let router = express.Router();

router.route("/register").post(RegisterUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);
router.route("/allUser").get(allUser);
router.route("/singleUser/:id").get(singleUser);
router.route("/updateSingleUser/:id").post(updateSingleUser);
router.route("/updateSingleUserStatus/:id").post(updateSingleUserStatus);
router.route("/bypassSingleUser/:id").patch(bypassSingleUser);
router.route("/verifySingleUser").patch(singleUpload, verifySingleUser);
router.route("/getHtmlData").get(getHtmlData);
router.route("/password/reset").post(resetPassword);
router.route("/getsignUser").patch(singleUpload, getsignUser);
router.route("/:id/verify/:token").get(verifyToken);
router.route("/updateKyc/:id").patch(updateKyc);
router.route("/setHtmlData").patch(setHtmlData);
router.route("/sendTicket").post(sendTicket);
router.route("/createAccount/:id").patch(createAccount);
router.route("/addCard/:id").patch(addCard);
router.route("/sendEmail").post(sendEmailCode);
router.route("/deletePayment/:id/:pId").get(deletePayment);
router.route("/createTicket").post(createTicket);
router.route("/updateMessage").patch(updateMessage);
// router.route("/admin/tickets/:i/update-status").put(adminUpdateTicket);
router.route("/admin/tickets").get(adminTickets);
router.route("/getUserTickets/:id").get(getUserTickets);
router.route("/getIndivTicket/:id/:ticketId").get(getIndivTicket);


module.exports = router;
