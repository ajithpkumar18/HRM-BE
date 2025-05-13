import { Contact } from "../schema/UserModels";

export const postContact = async (req: any, res: any) => {
    const userId = req.params.id;
    const { primaryContact,
        alternateContact,
        primaryEmergencyContact,
        alternateEmergencyContact } = req.body;

    const newContact = new Contact({
        userId: userId,
        primaryContact,
        alternateContact,
        primaryEmergencyContact,
        alternateEmergencyContact
    });

    try {

        await newContact.save();
        res.status(200).json({ message: "Contact created successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error creating contact" });
    }

    return;
}

export const getContactById = async (req: any, res: any) => {

    const userId = req.params.id;
    try {

        const userDocument = await Contact.findOne({ userId: userId });
        res.status(200).json(userDocument);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching document" });
    }

    return;

}

export const updateContact = async (req: any, res: any) => {
    const userId = req.params.id;
    const { primaryContact,
        alternateContact,
        primaryEmergencyContact,
        alternateEmergencyContact } = req.body;
    try {

        const updatedContact = await Contact.findOneAndUpdate({ userId: userId }, {
            primaryContact,
            alternateContact,
            primaryEmergencyContact,
            alternateEmergencyContact
        }, { new: true });
        res.status(200).json({ message: "Contact updated", updatedContact });
    }
    catch (error) {
        res.status(500).json({ message: "Error updating Contact" });
    }

    return;
}