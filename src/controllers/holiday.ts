import { Holiday } from "../schema/UserModels";
import { Request, Response } from "express";
export const postHolidays = async (req: any, res: any) => {

    const { date, holidayName } = req.body;

    const newHoliday = new Holiday({
        date: date,
        description: holidayName
    });

    try {
        await newHoliday.save();
        res.status(201).json("New holiday created successfully");
    }
    catch (error) {
        res.status(500).json({ message: "Error creating holiday" });

    }

    return;
}

export const getHoliday = async (req: any, res: any) => {

    try {
        const holidays = await Holiday.find();
        if (!holidays) {
            res.status(404).json({ message: "No users found" });
            return;
        }

        res.status(200).json(holidays);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching holidays" });
    }

    return;

}

export const deleteHoliday = async (req: any, res: any) => {
    const holidayId = req.params.id;

    if ((req as any).isAdmin) {
        try {
            await Holiday.findByIdAndDelete(holidayId);
            res.json({ message: "Holiday deleted successfully" });
        }
        catch (error) {
            res.status(500).json({ message: "Error deleting holiday" });
        }

    }
    else {
        res.status(403).json({ message: "Unauthorized" });
    }

    return;
}

export const updateHoliday = async (req: any, res: any) => {
    const holidayId = req.params.id;

    if ((req as any).isAdmin) {
        const { date, day, description } = req.body;
        try {

            const updatedHoliday = await Holiday.findByIdAndUpdate(holidayId, {
                date: date,
                day: day,
                description: description
            }, { new: true });
            res.json(updatedHoliday);
        }
        catch (error) {
            res.status(500).json({ message: "Error updating holiday" });
        }
    }
    else {
        res.status(403).json({ message: "Unauthorized" });
    }
    return;
}

export const bulkUploadHolidays = async (req: Request, res: Response) => {
    try {
        const holidays = req.body.holidays;
        if (!Array.isArray(holidays) || holidays.length === 0) {
            res.status(400).json({ message: "No holidays provided" });
            return;
        }

        const formattedHolidays = holidays.map(h => ({
            date: h.date ? new Date(h.date) : undefined,
            description: h.description || h.holidayName || ""
        }));

        const validHolidays = formattedHolidays.filter(h => h.date instanceof Date && !isNaN(h.date.getTime()));

        if (validHolidays.length === 0) {
            res.status(400).json({ message: "No valid holidays to upload" });
            return;
        }

        const result = await Holiday.insertMany(validHolidays);
        res.status(201).json({ message: "Holidays uploaded successfully", insertedCount: result.length });
    } catch (error) {
        console.error("Bulk upload holidays error:", error);
        res.status(500).json({ message: "Error uploading holidays", error });
    }
};

