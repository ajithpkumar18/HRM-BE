import { PrevEmployment, SocialLinks, User } from "../schema/UserModels";

export const postPrevEmployment = async (req: any, res: any) => {
    const { userId, companyName, designation, empType, address, dateOfJoining, dateOfLeaving } = req.body;
    const newPrevEmployment = new PrevEmployment({
        userId: userId,
        companyName: companyName,
        designation: designation,
        empType: empType,
        address: address,
        dateOfJoining: dateOfJoining,
        dateOfLeaving: dateOfLeaving
    });
    await newPrevEmployment.save();
    res.status(201).json({ message: "PrevEmployment created successfully" });
}


export const getPrevEmploymentById = async (req: any, res: any) => {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }

    res.json(user);
}

export const deletePrevEmployment = async (req: any, res: any) => {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    if ((req as any).isAdmin) {
        await User.findByIdAndDelete(userId);
        res.json({ message: "User deleted successfully" });
    }
    else {
        res.status(403).json({ message: "Unauthorized" });
    }
}

export const updatePrevEmployment = async (req: any, res: any) => {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    if ((req as any).isAdmin) {
        const { username, email, password } = req.body;
        const updatedUser = await User.findByIdAndUpdate(userId, {
            username: username,
            email: email,
            password: password
        }, { new: true });
        res.json(updatedUser);
    }
    else {
        res.status(403).json({ message: "Unauthorized" });
    }
}