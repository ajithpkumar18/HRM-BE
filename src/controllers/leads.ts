import { Request, Response } from "express";
import { Contact, User, Leads } from "../schema/UserModels";

export const getLeads = async (req: Request, res: Response) => {
    try {
        const leads = await Leads.find();
        res.status(200).json(leads);
    } catch (error) {
        console.error("Error fetching leads:", error);
        res.status(500).json({ message: "Error fetching leads", error });
    }
};

export const getLeadById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const lead = await Leads.findById(id);
        if (!lead) {
            res.status(404).json({ message: "Lead not found" });
            return;
        }
        res.status(200).json(lead);
    } catch (error) {
        console.error("Error fetching Leads:", error);
        res.status(500).json({ message: "Error fetching lead", error });
    }
};

export const createLead = async (req: Request, res: Response) => {
    const { assignedTo, contactPerson, contactNumber, marketNiche, service, status } = req.body;
    console.log(req.body)
    try {
        const user = await User.findOne({ companyID: assignedTo })
        if (user) {
            const newLead = new Leads({
                contact_person: contactPerson,
                contact_number: contactNumber,
                market_niche: marketNiche,
                service: service,
                assigned_to: assignedTo,
                status: "Pending"
            });
            await newLead.save();
            res.status(201).json({ message: "Lead created successfully", lead: newLead });
        }
        else {
            res.status(401).json({ message: "No user employee to be assigned to. Kindly enter the current company ID" });
        }
    } catch (error) {
        console.error("Error creating lead:", error);
        res.status(500).json({ message: "Error creating lead", error });
    }
    return
};

export const updateLead = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const updatedLead = await Leads.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedLead) {
            res.status(404).json({ message: "Lead not found" });
            return;
        }
        res.status(200).json({ message: "Lead updated successfully", lead: updatedLead });
    } catch (error) {
        console.error("Error updating lead:", error);
        res.status(500).json({ message: "Error updating lead", error });
    }
};

export const deleteLead = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const deletedLead = await Leads.findByIdAndDelete(id);
        if (!deletedLead) {
            res.status(404).json({ message: "Lead not found" });
            return;
        }
        res.status(200).json({ message: "Lead deleted successfully" });
    } catch (error) {
        console.error("Error deleting lead:", error);
        res.status(500).json({ message: "Error deleting lead", error });
    }
};