import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        min: 3,
        max: 20
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,

        min: 6,
        max: 20,
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,

        enum: ["HR", "Admin", "Employee"],
        default: "Employee"
    },
    companyID: {
        type: String,
        unique: true,
        trim: true
    },
    fullName: {
        type: String,

    },
    residence: {
        type: String,

    },
    dateOfBirth: {
        type: Date,

    },
    fullAddress: {
        type: String,

    },
    designation: {
        type: String,

    },
    empRole: {
        type: String,

    },
    empType: {
        type: String,

        enum: ["office", "remote", "hybrid", "part-time", "full-time"]
    },
    team: {
        type: String,

    },
    dateOfJoining: {
        type: Date,

    },
    dateOfLeaving: {
        type: Date,

    }
}, { timestamps: true })

const socialLinksSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",

    },
    fb_link: {
        type: String,

    },
    x_link: {
        type: String,

    },
    linkedin_link: {
        type: String,

    },
}, { timestamps: true })

const contactSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",

    },
    primaryContact: {
        type: String,

    },
    alternateContact: {
        type: String,

    },
    primaryEmergencyContact: {
        type: String,

    },
    alternateEmergencyContact: {
        type: String,

    }
}, { timestamps: true })

const documentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",

    },
    user_photo: {
        type: String,

    },
    aadhaar_front: {
        type: String,

    },
    aadhaar_back: {
        type: String,

    },
    pan_card: {
        type: String,

    },
})

const prevEmploymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",

    },
    companyName: {
        type: String,

    },
    designation: {
        type: String,

    },
    empType: {
        type: String,

        enum: ["office", "remote", "hybrid", "part-time", "full-time"]
    },
    address: {
        type: String,

    },
    dateOfJoining: {
        type: Date,

    },
    dateOfLeaving: {
        type: Date,

    }
}, { timestamps: true })

const attendanceSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    checkInTime: { type: Date },
    checkOutTime: { type: Date },
    status: { type: String, enum: ["Present", "Leave"], required: true },
    breaks: [
        {
            breakStartTime: { type: Date },
            breakEndTime: { type: Date },
        },
    ],
});

const HolidaySchema = new mongoose.Schema({
    date: {
        type: Date,

    },
    description: {
        type: String,

    },
}, { timestamps: true })

const LeadsSchema = new mongoose.Schema(
    {
        contact_person: {
            type: String,
            required: true,
            trim: true,
        },
        contact_number: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
        },
        website: {
            type: String,
            required: true,
            trim: true,
        },
        market_niche: {
            type: String,
            required: true,
            trim: true,
        },
        service: {
            type: String,
            required: true,
            trim: true,
        },
        assigned_to: {
            type: String
        },
        status: {
            type: String,
            enum: ["Pending", "In Progress", "Completed", "Closed"],
            default: "Pending",
        },
    },
    { timestamps: true }
);
const leaveSchema = new mongoose.Schema(
    {
        companyID: {
            type: String,
            ref: "User",
            refPath: "companyID",
            required: true,
            trim: true
        },
        leaveType: {
            type: String,
            enum: ["Sick Leave", "Casual Leave", "Earned Leave", "Maternity Leave", "Paternity Leave", "Unpaid Leave"],
            required: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        reason: {
            type: String,
            required: true,
            trim: true,
        },
        status: {
            type: String,
            enum: ["Pending", "Approved", "Rejected"],
            default: "Pending",
        },
        appliedOn: {
            type: Date,
            default: Date.now,
        },
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        comments: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true }
);

const candidateSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        phone: {
            type: String,
            required: true,
            trim: true,
        },
        positionApplied: {
            type: String,
            required: true,
            trim: true,
        },
        resumeLink: {
            type: String,
            trim: true,
        },
        status: {
            type: String,
            enum: ["Applied", "Screening", "Interview", "Offered", "Rejected", "Hired"],
            default: "Applied",
        },
        appliedOn: {
            type: Date,
            default: Date.now,
        }
    },
    { timestamps: true }
);

export const User = mongoose.model("User", userSchema)
export const SocialLinks = mongoose.model("SocialLinks", socialLinksSchema)
export const Contact = mongoose.model("Contact", contactSchema)
export const Document = mongoose.model("Document", documentSchema)
export const PrevEmployment = mongoose.model("PrevEmployment", prevEmploymentSchema)
export const Attendance = mongoose.model("Attendance", attendanceSchema)
export const Holiday = mongoose.model("Holiday", HolidaySchema)
export const Leads = mongoose.model("Leads", LeadsSchema);
export const Leave = mongoose.model("Leave", leaveSchema);
export const Candidate = mongoose.model("Candidate", candidateSchema);





