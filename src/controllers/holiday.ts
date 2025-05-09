import { Holiday, SocialLinks, User } from "../schema/UserModels";

export const postHolidays = async (req: any, res: any) => {

    const { date, day, description } = req.body;

    const newHoliday = new Holiday({
        date: date,
        day: day,
        description: description
    });

    await newHoliday.save();
    res.status(201).json({ message: "New Holiday created successfully" });
}

export const getHoliday = async (req: any, res: any) => {

    const holidays = await Holiday.find();

    if (!holidays) {
        res.status(404).json({ message: "No users found" });
        return;
    }

    console.log((req as any).isAdmin, "req.body");

    res.json(holidays);

    return;
}

export const deleteHoliday = async (req: any, res: any) => {
    const holidayId = req.params.id;

    const holiday = await Holiday.findById(holidayId);

    if (!holiday) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    if ((req as any).isAdmin) {
        await Holiday.findByIdAndDelete(holidayId);
        res.json({ message: "User deleted successfully" });
    }
    else {
        res.status(403).json({ message: "Unauthorized" });
    }
}

export const updateHoliday = async (req: any, res: any) => {
    const holidayId = req.params.id;
    const holiday = await Holiday.findById(holidayId);
    if (!holiday) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    if ((req as any).isAdmin) {
        const { date, day, description } = req.body;

        const updatedHoliday = await Holiday.findByIdAndUpdate(holidayId, {
            date: date,
            day: day,
            description: description
        }, { new: true });

        res.json(updatedHoliday);
    }
    else {
        res.status(403).json({ message: "Unauthorized" });
    }
}