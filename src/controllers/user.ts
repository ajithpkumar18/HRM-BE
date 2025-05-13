import { Contact, Document, PrevEmployment, SocialLinks, User, UserDetails } from "../schema/UserModels";

export const getUser = async (req: any, res: any) => {

    const users = await User.find().select("username isAdmin _id");

    if (!users) {
        res.status(404).json({ message: "No users found" });
        return;
    }

    console.log((req as any).isAdmin, "req.body");

    res.json(users);

    return;
}

export const getUserById = async (req: any, res: any) => {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }

    res.json(user);
}

export const deleteUser = async (req: any, res: any) => {

    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }

    if ((req as any).isAdmin) {

        try {

            await UserDetails.findOneAndDelete({ userId: userId });
            await SocialLinks.findOneAndDelete({ userId: userId });
            await PrevEmployment.findOneAndDelete({ userId: userId });
            await Document.findOneAndDelete({ userId: userId });
            await Contact.findOneAndDelete({ userId: userId });
            await User.findByIdAndDelete(userId);
            res.json({ message: "User deleted successfully" });

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