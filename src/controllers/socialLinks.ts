import { SocialLinks, User } from "../schema/UserModels";

export const postSocial = async (req: any, res: any) => {
    const { userId, fb_link, x_link, linkedin_link } = req.body;
    const newSocial = new SocialLinks({
        fb_link: fb_link,
        x_link: x_link,
        linkedin_link: linkedin_link,
        userId: userId
    });
    await newSocial.save();
    res.status(201).json(newSocial);
}

export const getSocial = async (req: any, res: any) => {

    const users = await SocialLinks.find().select("username isAdmin _id");

    if (!users) {
        res.status(404).json({ message: "No users found" });
        return;
    }

    console.log((req as any).isAdmin, "req.body");

    res.json(users);

    return;
}

export const getSocialById = async (req: any, res: any) => {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }

    res.json(user);
}

export const deleteSocial = async (req: any, res: any) => {
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

export const updateSocial = async (req: any, res: any) => {
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