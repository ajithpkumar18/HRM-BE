import { Attendance } from "../schema/UserModels";
import { formatTime } from "../utils/utils";

export const loginAttendance = async (req: any, res: any) => {
    const userId = req.userID;
    const status = req.body.status;

    const today = new Date();
    const istDate = new Date(today.getTime() + 5.5 * 60 * 60 * 1000);
    const dateOnly = new Date().toISOString().split('T')[0]
    console.log("Login attempt by user:", userId);

    try {

        const existingAttendance = await Attendance.findOne({ userId: userId, date: dateOnly });

        if (existingAttendance) {
            res.status(200).json({ message: "Attendance already marked for today", attendance: existingAttendance });
            return;
        }
        console.log(dateOnly)

        const newAttendance = new Attendance({
            userId: userId,
            date: dateOnly,
            checkInTime: istDate,
            status: status === "Present" ? "Present" : "Leave"
        });


        await newAttendance.save();

        res.status(201).json({
            message: "Attendance marked successfully",
            attendance: newAttendance
        });
    } catch (error) {
        console.error("Error marking attendance:", error);
        res.status(500).json({ message: "Error marking attendance", error });
    }
}

export const logoutAttendance = async (req: any, res: any) => {
    const userId = req.userID;
    const today = new Date();
    const istDate = new Date(today.getTime() + 5.5 * 60 * 60 * 1000);
    const dateOnly = new Date().toISOString().split('T')[0]

    console.log("Logout attempt by user:", userId);

    try {
        // Find the attendance record for the user for today with status "Present"
        const attendance = await Attendance.findOne({ userId: userId, date: dateOnly, status: "Present" });

        if (!attendance) {
            res.status(404).json({ message: "You are absent for today. No logout time can be recorded." });
            return;
        }

        // Check if the user has already logged out
        if (attendance.checkOutTime) {
            res.status(400).json({ message: "You have already logged out for today." });
            return;
        }

        // Update the logout time (checkOutTime) with the current time
        attendance.checkOutTime = istDate;
        await attendance.save();

        res.status(200).json({
            message: "Logout marked successfully",
            logoutTime: istDate, // Return the logout time
            attendance
        });
    } catch (error) {
        console.error("Error marking logout:", error);
        res.status(500).json({ message: "Error marking logout", error });
    }
}

export const updateAttendance = async (req: any, res: any) => {
    const userId = req.params.id;
    const checkInTime = req.body;
    const dateOnly = new Date(checkInTime.setHours(0, 0, 0, 0));
    try {
        const updatedAttendance = await Attendance.findOneAndUpdate({ userId: userId, date: dateOnly, status: "Present" }, {
            checkInTime
        }, { new: true });
        res.status(200).json({ message: "Login time updated successfully", updatedAttendance });
    }
    catch (error) {
        res.status(500).json({ message: "Error updating Attendance" });
    }

    return;
}

export const getAttendance = async (req: any, res: any) => {
    const userId = req.params.id;
    try {
        const attendance = await Attendance.find({ userId: userId });
        if (!attendance) {
            res.status(404).json({ message: "No attendance found" });
            return;
        }
        res.status(200).json(attendance);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching attendance" });
    }

    return;
}

export const getDailyAttendance = async (req: any, res: any) => {
    const { date } = req.query;

    if (!date) {
        res.status(400).json({ message: "Date is required" });
        return;
    }

    try {
        const attendanceRecords = await Attendance.aggregate([
            {
                $match: { date: new Date(date) }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            {
                $unwind: "$userDetails"
            },
            {
                $project: {
                    _id: 1,
                    date: 1,
                    status: 1,
                    checkInTime: 1,
                    checkOutTime: 1,
                    "userDetails.username": 1,
                    "userDetails.email": 1
                }
            }
        ]);

        if (!attendanceRecords || attendanceRecords.length === 0) {
            res.status(404).json({ message: "No attendance records found for the given date" });
            return;
        }

        res.status(200).json({ message: "Attendance records fetched successfully", attendanceRecords });
    } catch (error) {
        console.error("Error fetching attendance records:", error);
        res.status(500).json({ message: "Error fetching attendance records", error });
    }
};