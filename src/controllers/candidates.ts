import { Request, Response } from "express";
import { Candidate } from "../schema/UserModels";


export const addCandidate = async (req: Request, res: Response) => {
    try {
        const candidate = new Candidate(req.body);
        await candidate.save();
        res.status(201).json({ message: "Candidate added successfully", candidate });
    } catch (error) {
        console.error("Error adding candidate:", error);
        res.status(500).json({ message: "Error adding candidate", error });
    }
};

export const getCandidates = async (req: Request, res: Response) => {
    try {
        const candidates = await Candidate.find().sort({ appliedOn: -1 });
        res.status(200).json({ message: "Candidates fetched successfully", candidates });
    } catch (error) {
        console.error("Error fetching candidates:", error);
        res.status(500).json({ message: "Error fetching candidates", error });
    }
};

export const getCandidateById = async (req: Request, res: Response) => {
    try {
        const candidate = await Candidate.findById(req.params.id);
        if (!candidate) {
            return res.status(404).json({ message: "Candidate not found" });
        }
        res.status(200).json({ candidate });
    } catch (error) {
        console.error("Error fetching candidate:", error);
        res.status(500).json({ message: "Error fetching candidate", error });
    }
};


export const removeCandidate = async (req: Request, res: Response) => {
    try {
        const candidate = await Candidate.findByIdAndDelete(req.params.id);
        if (!candidate) {
            return res.status(404).json({ message: "Candidate not found" });
        }
        res.status(200).json({ message: "Candidate removed successfully", candidate });
    } catch (error) {
        console.error("Error removing candidate:", error);
        res.status(500).json({ message: "Error removing candidate", error });
    }
};