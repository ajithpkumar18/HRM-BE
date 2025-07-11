import { Request, Response, Router } from "express";
import { authMiddleware, authorizeRoles } from "../middlewares/auth";
import { getUserDetails, getUserDetailsByCompanyID, getUserDetailsById, postUserDetails, SearchUserDetails, updateUserDetails } from "../controllers/userDetails";
import { bulkUploadHolidays, deleteHoliday, getHoliday, postHolidays, updateHoliday } from "../controllers/holiday";
import { deleteUser } from "../controllers/userDetails";
import { get } from "mongoose";
import { getPrevEmploymentById, postPrevEmployment, updatePrevEmployment } from "../controllers/prevEmployment";
import { getSocialById, postSocialById, updateSocialById } from "../controllers/socialLinks";
import { getDocumentById, postDocumentId, updateDocumentId } from "../controllers/document";
import { getContactById, postContactId, updateContactId } from "../controllers/contact";
import { addBreak, getAttendance, getDailyAttendance, loginAttendance, logoutAttendance, updateAttendance } from "../controllers/attendance";
import { Logout, SignIn, SignUp } from "../controllers/auth";
import { bulkUploadLeads, createLead, deleteLead, getLeadById, getLeads, updateLead } from "../controllers/leads";
import { getLeaves, getLeaveById, createLeave, updateLeave, deleteLeave, SearchLeaves } from "../controllers/leaves";
import { addCandidate, getCandidates } from "../controllers/candidates";

const router = Router();

router.post('/signin', SignIn);

router.post('/signup', SignUp)

router.post('/logout', Logout)


router.get("/employees", authMiddleware, authorizeRoles(["Admin", "HR"]), getUserDetails);

router.get("/employee", authMiddleware, authorizeRoles(["Admin", "HR"]), getUserDetailsById);

router.get("/employee/search", authMiddleware, authorizeRoles(["Admin", "HR"]), SearchUserDetails);

router.get("/employee/:id", authMiddleware, authorizeRoles(["Admin", "HR"]), getUserDetailsByCompanyID);


router.post("/employee", authMiddleware, authorizeRoles(["Admin", "HR"]), postUserDetails);

router.put("/employee", authMiddleware, authorizeRoles(["Admin", "HR", "Employee"]), updateUserDetails);

router.delete("/employee/:id", authMiddleware, authorizeRoles(["Admin", "HR"]), deleteUser);


router.get("/prevEmployment/:id", authMiddleware, authorizeRoles(["Admin", "HR"]), getPrevEmploymentById);

router.post("/prevEmployment/:id", authMiddleware, authorizeRoles(["Admin", "HR", "Employee"]), postPrevEmployment);

router.put("/prevEmployment/:id", authMiddleware, authorizeRoles(["Admin", "HR", "Employee"]), updatePrevEmployment);


router.get("/socialLinks/id", authMiddleware, authorizeRoles(["Admin", "HR", "Employee"]), getSocialById)
router.post("/socialLinks/:id", authMiddleware, authorizeRoles(["Admin", "HR", "Employee"]), postSocialById)
router.put("/socialLinks/:id", authMiddleware, authorizeRoles(["Admin", "HR", "Employee"]), updateSocialById)

router.get("/document/:id", authMiddleware, authorizeRoles(["Admin", "HR", "Employee"]), getDocumentById)
router.post("/document/:id", authMiddleware, authorizeRoles(["Admin", "HR", "Employee"]), postDocumentId)
router.put("/document/:id", authMiddleware, authorizeRoles(["Admin", "HR", "Employee"]), updateDocumentId)

router.get("/contact/:id", authMiddleware, authorizeRoles(["Admin", "HR", "Employee"]), getContactById)
router.post("/contact/:id", authMiddleware, authorizeRoles(["Admin", "HR", "Employee"]), postContactId)
router.put("/contact/:id", authMiddleware, authorizeRoles(["Admin", "HR", "Employee"]), updateContactId)

router.get("/attendance/daily", authMiddleware, authorizeRoles(["HR", "Admin"]), getDailyAttendance);
router.post("/attendance/break", authMiddleware, authorizeRoles(["HR", "Admin", "Employee"]), addBreak);
router.get("/attendance/:id", authMiddleware, authorizeRoles(["Admin", "HR", "Employee"]), getAttendance);
router.post("/attendance/clockin", authMiddleware, authorizeRoles(["Admin", "HR", "Employee"]), loginAttendance);
router.post("/attendance/clockout", authMiddleware, authorizeRoles(["Admin", "HR", "Employee"]), logoutAttendance);
router.put("/attendance/:id", authMiddleware, authorizeRoles(["Admin", "HR", "Employee"]), updateAttendance);


router.get("/leads", authMiddleware, authorizeRoles(["Admin", "HR"]), getLeads);
router.get("/leads/:id", authMiddleware, authorizeRoles(["Admin", "HR"]), getLeadById);
router.post("/leads", authMiddleware, authorizeRoles(["Admin", "HR"]), createLead);
router.patch("/leads/:id", authMiddleware, authorizeRoles(["Admin", "HR"]), updateLead);
router.delete("/leads/:id", authMiddleware, authorizeRoles(["Admin", "HR"]), deleteLead);
router.post(
    "/leads/bulk-upload",
    authMiddleware,
    authorizeRoles(["Admin", "HR"]),
    bulkUploadLeads
);

router.get("/holidays", authMiddleware, authorizeRoles(["Admin", "HR", "Employee"]), getHoliday);
router.post("/holidays", authMiddleware, authorizeRoles(["Admin", "HR"]), postHolidays);
router.put("/holidays/:id", authMiddleware, authorizeRoles(["Admin", "HR"]), updateHoliday);
router.delete("/holidays/:id", authMiddleware, authorizeRoles(["Admin", "HR"]), deleteHoliday);
router.post(
    "/holidays/bulk-upload",
    authMiddleware,
    authorizeRoles(["Admin", "HR"]),
    bulkUploadHolidays
);

router.get("/leaves", authMiddleware, authorizeRoles(["Admin", "HR"]), getLeaves);
router.get("/leaves/search", authMiddleware, authorizeRoles(["Admin", "HR"]), SearchLeaves);
router.get("/leaves/:id", authMiddleware, authorizeRoles(["Admin", "HR", "Employee"]), getLeaveById);
router.post("/leaves", authMiddleware, authorizeRoles(["Admin", "HR", "Employee"]), createLeave);
router.put("/leaves/:id", authMiddleware, authorizeRoles(["Admin", "HR"]), updateLeave);
router.delete("/leaves/:id", authMiddleware, authorizeRoles(["Admin", "HR"]), deleteLeave);

router.get("/candidates", authMiddleware, authorizeRoles(["Admin", "HR"]), getCandidates);
router.get("/candidates/search", authMiddleware, authorizeRoles(["Admin", "HR"]), SearchLeaves);
router.get("/candidates/:id", authMiddleware, authorizeRoles(["Admin", "HR"]), getLeaveById);
router.post("/candidates", authMiddleware, authorizeRoles(["Admin", "HR"]), addCandidate);
router.put("/candidates/:id", authMiddleware, authorizeRoles(["Admin", "HR"]), updateLeave);
router.delete("/candidates/:id", authMiddleware, authorizeRoles(["Admin", "HR"]), deleteLeave);

export default router;