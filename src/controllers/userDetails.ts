import { User, UserDetails } from "../schema/UserModels";

export const getUserDetails = async (req: any, res: any) => {

    const userDetails = await UserDetails.find();;
    if (!userDetails) {
        res.status(404).json({ message: "No users found" });
        return;
    }

    console.log((req as any).isAdmin, "req.body");

    res.json(userDetails);

    return;
}

export const getUserDetailsById = async (req: any, res: any) => {
    const userId = req.params.id;
    const userDetails = await User.findById(userId);

    if (!userDetails) {
        res.status(404).json({ message: "User not found" });
        return;
    }

    res.json(userDetails);
}

export const deleteUserDetails = async (req: any, res: any) => {
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

export const updateUserDetails = async (req: any, res: any) => {
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