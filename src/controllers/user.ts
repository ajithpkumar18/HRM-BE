import { Contact, Document, PrevEmployment, SocialLinks, User } from "../schema/UserModels";

export const getUser = async (req: any, res: any) => {

    const users = await User.find().select("username isAdmin _id");

    if (!users) {
        res.status(404).json({ message: "No users found" });
        return;
    }



    res.json(users);

    return;
}

export const getUserById = async (req: any, res: any) => {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }

    res.json(user);
}

export const deleteUser = async (req: any, res: any) => {

    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }

    if (req.user.role === "Admin" || req.user.role === "HR") {

        try {

            await SocialLinks.findOneAndDelete({ userId: userId });
            await PrevEmployment.findOneAndDelete({ userId: userId });
            await Document.findOneAndDelete({ userId: userId });
            await Contact.findOneAndDelete({ userId: userId });
            await User.findByIdAndDelete(userId);
            res.status(200).json({ message: "User deleted successfully", succeess: true });

            return;
        }
        catch (error) {
            res.status(500).json({ message: "Error deleting user" });
            return;
        }

    }
    else {
        res.status(403).json({ message: "Unauthorized" });
    }
    return;
}

export const updateUser = async (req: any, res: any) => {
    const userId = req.user.id;
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