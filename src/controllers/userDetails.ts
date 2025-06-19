import { log } from "console";
import { Contact, Document, PrevEmployment, SocialLinks, User } from "../schema/UserModels";
import bcrypt from "bcrypt";


export const postUserDetails = async (req: any, res: any) => {
    const userId = req.user?.id;
    const userRole = req.user?.role;
    let newPassword = '';

    if (!["HR", "Admin"].includes(userRole)) {
        res.status(403).json({ message: "Unauthorized. Only HR or Admin can create user details." });
        return;
    }

    const { username,
        email,
        password,
        isAdmin,
        role,
        fullName,
        companyID,
        residence,
        dateOfBirth,
        fullAddress,
        designation,
        empRole,
        empType,
        team,
        dateOfJoining,
        dateOfLeaving
    } = req.body;
    if (password) {
        newPassword = await bcrypt.hash(password, 10);
    }

    const newUserDetails = new User({
        username,
        email,
        password: newPassword,
        isAdmin,
        role,
        userId,
        fullName,
        companyID,
        residence,
        dateOfBirth,
        fullAddress,
        designation,
        empRole,
        empType,
        team,
        dateOfJoining,
        dateOfLeaving
    });

    try {

        const existingUserDetails = await User.findOne({ userId: userId });
        if (existingUserDetails) {
            res.status(400).json({ message: "User details already exist" });
            return;
        }

        await newUserDetails.save();
        res.status(201).json({ message: "User details created successfully", userDetails: newUserDetails });
    } catch (error) {
        console.error("Error creating user details:", error);
        res.status(500).json({ message: "Error creating user details", error });
    }
}

export const getUserDetails = async (req: any, res: any) => {

    const userDetails = await User.find().sort({ createdAt: -1 });
    if (!userDetails) {
        res.status(404).json({ message: "No users found" });
        return;
    }

    console.log((req as any).isAdmin, "req.body");

    res.json(userDetails);

    return;
}

export const getUserDetailsById = async (req: any, res: any) => {
    console.log("get Employee by ID");
    const companyID = req.params.id;
    const userID = req.userID;
    console.log(companyID, "userId");
    try {

        const userDetails = await User.findOne({ _id: userID });
        if (!userDetails) {

            res.status(404).json({ message: "User not found" });

            return;

        }

        res.status(200).json(userDetails);

    }
    catch (error) {
        res.status(500).json({ message: "Error fetching user details" });
        return;
    }
    return;
}

export const getUserDetailsByCompanyID = async (req: any, res: any) => {
    console.log("get Employee by ID");
    const companyID = req.params.id;
    const userID = req.userID;
    console.log(companyID, "userId");
    try {

        const userDetails = await User.findOne({ companyID });
        if (!userDetails) {

            res.status(404).json({ message: "User not found" });

            return;

        }

        res.status(200).json(userDetails);

    }
    catch (error) {
        res.status(500).json({ message: "Error fetching user details" });
        return;
    }
    return;
}

export const SearchUserDetails = async (req: any, res: any) => {
    const query = req.query.q;

    console.log(query, "SearchUserDetails")
    try {
        console.log("searching users");

        const userDetails = await User.find({
            $or: [
                { username: { $regex: query, $options: 'i' } },
                { companyID: { $regex: query, $options: 'i' } }
            ]
        });
        console.log("user details", userDetails)

        if (!userDetails || userDetails.length === 0) {
            res.status(404).json({ message: "No users found matching the search criteria" });
            return;
        }

        const data = userDetails.map(user => ({
            username: user.username,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
            companyID: user.companyID,
            residence: user.residence,
            designation: user.designation,
            empRole: user.empRole,
            empType: user.empType,
            team: user.team,
            dateOfJoining: user.dateOfJoining
        }));
        res.status(200).json({ message: "Users found", data });
    } catch (error) {
        console.error("Error searching user details:", error);
        res.status(500).json({ message: "Error searching user details", error });
    }
};

export const updateUserDetails = async (req: any, res: any) => {
    console.log("UpdateDeyails")
    const userRole = req.user?.role;
    const authenticatedUserId = req.user?.id;
    const companyIDToUpdate = req.params.id;
    const userID = req.userID;

    try {
        const userDetails = await User.findOne({
            $or: [
                { companyID: companyIDToUpdate },
                { _id: userID }
            ]
        });

        if (!userDetails) {
            res.status(404).json({ message: "User details not found" });
            return;
        }

        if (userRole === "Employee" && authenticatedUserId !== userDetails._id.toString()) {
            console.log(authenticatedUserId, userDetails._id)
            res.status(403).json({ message: "Unauthorized. Employees can only update their own details." });
            return;
        }

        const {
            username,
            email,
            password,
            isAdmin,
            role,
            fullName,
            companyID,
            residence,
            dateOfBirth,
            fullAddress,
            designation,
            empRole,
            empType,
            team,
            address,
            dateOfJoining,
            dateOfLeaving
        } = req.body;

        let newPassword = userDetails.password;
        if (password) {
            newPassword = await bcrypt.hash(password, 10);
        }
        const updatedUserDetails = await User.findOneAndUpdate(
            {
                $or: [
                    { companyID: companyIDToUpdate },
                    { _id: userID }
                ]
            },
            {
                username,
                email,
                password: newPassword,
                isAdmin,
                role,
                fullName,
                companyID,
                residence,
                dateOfBirth,
                fullAddress,
                designation,
                empRole,
                empType,
                team,
                address,
                dateOfJoining,
                dateOfLeaving
            },
            { new: true }
        );

        res.status(200).json({ message: "User details updated successfully", updatedUserDetails });
    } catch (error) {
        console.error("Error updating user details:", error);
        res.status(500).json({ message: "Error updating user details", error });
    }
};

export const deleteUser = async (req: any, res: any) => {
    const userID = req.userID;
    const companyIdToDelete = req.params.id;
    console.log(req.params)
    try {

        const user = await User.findOneAndDelete({ _id: req.params.id });
        console.log(companyIdToDelete, user);


        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }


        await SocialLinks.findOneAndDelete({ userID: user._id });
        await PrevEmployment.findOneAndDelete({ userID: user._id });
        await Document.findOneAndDelete({ userID: user._id });
        await Contact.findOneAndDelete({ userID: user._id });

        await User.findOneAndDelete({ companyID: companyIdToDelete });

        res.status(200).json({ message: "User deleted successfully", success: true });

    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Error deleting user", error });
    }
};