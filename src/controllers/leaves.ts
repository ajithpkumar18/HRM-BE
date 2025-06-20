import { Request, Response } from "express";
import { Leave, User } from "../schema/UserModels";
import mongoose, { Mongoose } from "mongoose";

export const getLeaves = async (req: Request, res: Response) => {
    try {
        const leaves = await Leave.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'companyID',
                    foreignField: 'companyID',
                    as: 'userDetails'
                }
            },
            {
                $unwind: {
                    path: '$userDetails',
                }
            },
            {
                $project: {
                    leaveType: 1,
                    startDate: 1,
                    endDate: 1,
                    reason: 1,
                    status: 1,
                    appliedOn: 1,
                    totalDays: 1,
                    approvedBy: 1,
                    companyID: 1,
                    'userDetails.fullName': 1,
                    'userDetails.email': 1,
                    'userDetails.designation': 1,
                    'userDetails.role': 1
                }
            }
        ])
        res.status(200).json({ message: "Leaves fetched successfully", data: leaves });
    } catch (error) {
        console.error("Error fetching leaves:", error);
        res.status(500).json({ message: "Error fetching leaves", error });
    }
};


export const getLeaveById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const leave = await Leave.findById(id).populate("userId", "fullName email");
        if (!leave) {
            res.status(404).json({ message: "Leave not found" });
            return;
        }
        res.status(200).json({ message: "Leave fetched successfully", data: leave });
    } catch (error) {
        console.error("Error fetching leave:", error);
        res.status(500).json({ message: "Error fetching leave", error });
    }
};


export const createLeave = async (req: Request, res: Response) => {
    const { companyID, leaveType, startDate, endDate, reason } = req.body;


    try {
        const newLeave = new Leave({ companyID, leaveType, startDate, endDate, reason });
        await newLeave.save();
        res.status(201).json({ message: "Leave created successfully", data: newLeave });
    } catch (error) {
        console.error("Error creating leave:", error);
        res.status(500).json({ message: "Error creating leave", error });
    }
};


export const updateLeave = async (req: Request, res: Response) => {
    const { id } = req.params;
    const updates = req.body;
    try {
        const updatedLeave = await Leave.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedLeave) {
            res.status(404).json({ message: "Leave not found" });
            return;
        }
        res.status(200).json({ message: "Leave updated successfully", data: updatedLeave });
    } catch (error) {
        console.error("Error updating leave:", error);
        res.status(500).json({ message: "Error updating leave", error });
    }
};

export const deleteLeave = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const deletedLeave = await Leave.findByIdAndDelete(id);
        if (!deletedLeave) {
            res.status(404).json({ message: "Leave not found" });
            return;
        }
        res.status(200).json({ message: "Leave deleted successfully", data: deletedLeave });
    } catch (error) {
        console.error("Error deleting leave:", error);
        res.status(500).json({ message: "Error deleting leave", error });
    }
};

export const SearchLeaves = async (req: any, res: any) => {
    const query = req.query.q;


    try {


        const userDetails = await User.find(
            { username: query }
        );


        if (!userDetails || userDetails.length === 0) {
            res.status(404).json({ message: "No users found matching the search criteria" });
            return;
        }

        const leaves = await Leave.find({ companyID: { $in: userDetails.map(user => user.companyID) } })
        res.status(200).json({ message: "Leaves found", leaves });
    } catch (error) {
        console.error("Error searching user details:", error);
        res.status(500).json({ message: "Error searching user details", error });
    }
};