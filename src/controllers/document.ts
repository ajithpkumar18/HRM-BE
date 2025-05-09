import { Document, SocialLinks, User } from "../schema/UserModels";

export const postDocument = async (req: any, res: any) => {
    const { userId, user_photo, aadhaar_front, aadhaar_back, pan_card } = req.body;
    const newDocument = new Document({
        userId: userId,
        user_photo: user_photo,
        aadhaar_front: aadhaar_front,
        aadhaar_back: aadhaar_back,
        pan_card: pan_card
    });

    await newDocument.save();
    res.status(201).json(newDocument);
}

export const getDocumentById = async (req: any, res: any) => {

    const userId = req.params.id;

    const user = await Document.findById(userId);

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