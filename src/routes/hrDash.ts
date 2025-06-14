import { Request, Response, Router } from "express";
import { authMiddleware, authorizeRoles } from "../middlewares/auth";
import { getUserDetails, getUserDetailsByCompanyID, getUserDetailsById, postUserDetails, updateUserDetails } from "../controllers/userDetails";
import { deleteHoliday, getHoliday, postHolidays, updateHoliday } from "../controllers/holiday";
import { deleteUser } from "../controllers/userDetails";
import { get } from "mongoose";
import { getPrevEmploymentById, postPrevEmployment, updatePrevEmployment } from "../controllers/prevEmployment";
import { getSocialById, postSocialById, updateSocialById } from "../controllers/socialLinks";
import { getDocumentById, postDocumentId, updateDocumentId } from "../controllers/document";
import { getContactById, postContactId, updateContactId } from "../controllers/contact";
import { getAttendance, getDailyAttendance, loginAttendance, logoutAttendance, updateAttendance } from "../controllers/attendance";
import { SignIn, SignUp } from "../controllers/auth";
import { createLead, deleteLead, getLeadById, getLeads, updateLead } from "../controllers/leads";

const router = Router();

router.post('/signin', SignIn);

router.post('/signup', SignUp)


router.get("/employees", authMiddleware, authorizeRoles(["Admin", "HR"]), getUserDetails);

router.get("/employee", authMiddleware, authorizeRoles(["Admin", "HR"]), getUserDetailsById);
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
router.get("/attendance/:id", authMiddleware, authorizeRoles(["Admin", "HR", "Employee"]), getAttendance);
router.post("/attendance/login", authMiddleware, authorizeRoles(["Admin", "HR", "Employee"]), loginAttendance);
router.post("/attendance/logout", authMiddleware, authorizeRoles(["Admin", "HR", "Employee"]), logoutAttendance);
router.put("/attendance/:id", authMiddleware, authorizeRoles(["Admin", "HR", "Employee"]), updateAttendance);


router.get("/leads", authMiddleware, authorizeRoles(["Admin", "HR"]), getLeads);
router.get("/leads/:id", authMiddleware, authorizeRoles(["Admin", "HR"]), getLeadById);
router.post("/leads", authMiddleware, authorizeRoles(["Admin", "HR"]), createLead);
router.put("/leads/:id", authMiddleware, authorizeRoles(["Admin", "HR"]), updateLead);
router.delete("/leads/:id", authMiddleware, authorizeRoles(["Admin", "HR"]), deleteLead);


router.get("/holidays", authMiddleware, authorizeRoles(["Admin", "HR", "Employee"]), getHoliday);
router.post("/holidays", authMiddleware, authorizeRoles(["Admin", "HR"]), postHolidays);
router.put("/holidays/:id", authMiddleware, authorizeRoles(["Admin", "HR"]), updateHoliday);
router.delete("/holidays/:id", authMiddleware, authorizeRoles(["Admin", "HR"]), deleteHoliday);

export default router;