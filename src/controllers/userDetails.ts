import { User, UserDetails } from "../schema/UserModels";


export const postUserDetails = async (req: any, res: any) => {
    const userId = req.id;
    const {
        fullName,
        residece,
        dateOfBirth,
        fullAddress,
        designation,
        empRole,
        empType,
        team,
        address,
        datOfJooining,
        dateOfLeaving
    } = req.body;
    const newUserDetails = new UserDetails({
        userId,
        fullName,
        residece,
        dateOfBirth,
        fullAddress,
        designation,
        empRole,
        empType,
        team,
        address,
        datOfJooining,
        dateOfLeaving
    });
    try {
        await newUserDetails.save();
        res.status(201).json(newUserDetails);
        return;
    }
    catch (error) {
        res.status(500).json({ message: "Error creating user details" });
        console.log(error);

        return;
    }

}

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

    const userDetails = await UserDetails.findOne({ userId: userId });

    if (!userDetails) {

        res.status(404).json({ message: "User not found" });

        return;

    }

    res.json(userDetails);
    return;
}

export const updateUserDetails = async (req: any, res: any) => {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    if ((req as any).isAdmin) {
        const {
            fullName,
            residece,
            dateOfBirth,
            fullAddress,
            designation,
            empRole,
            empType,
            team,
            address,
            datOfJooining,
            dateOfLeaving } = req.body;
        const updatedUser = await UserDetails.findOneAndUpdate({ userId: userId }, {
            fullName,
            residece,
            dateOfBirth,
            fullAddress,
            designation,
            empRole,
            empType,
            team,
            address,
            datOfJooining,
            dateOfLeaving
        }, { new: true });
        res.status(200).json({ message: "User details updated", updatedUser });
    }
    else {
        res.status(403).json({ message: "Unauthorized" });
    }
}