import Contact, { IContact } from "../models/Contact";

export async function createNewContact(
  email?: string,
  phoneNumber?: string
): Promise<IContact> {
  return await new Contact({ email, phoneNumber }).save();
}

export async function getContactsById(id: string): Promise<IContact[]> {
  return await Contact.find({
    $or: [{ _id: id }, { linkedId: id }],
  }).sort({ createdAt: 1 });
}

export async function getContacts(
  email?: string,
  phoneNumber?: string
): Promise<IContact[]> {
  if (email && phoneNumber) {
    return await Contact.find({ $or: [{ email }, { phoneNumber }] }).sort({
      createdAt: 1,
    });
  } else if (email) {
    return await Contact.find({ email }).sort({ createdAt: 1 });
  } else {
    return await Contact.find({ phoneNumber }).sort({ createdAt: 1 });
  }
}

interface updateContact {
  _id?: string;
  email: string;
  phoneNumber: string;
}

export async function updateContact(
  id: string,
  contact: updateContact
): Promise<IContact | null> {
  return await Contact.findByIdAndUpdate(contact._id, {
    email: contact.email,
    phoneNumber: contact.phoneNumber,
    linkedId: id,
    linkPrecedence: "secondary",
    updatedAt: Date.now(),
  });
}

interface IdentifyResponse {
  contact: {
    primaryContactId: string;
    emails: string[];
    phoneNumbers: string[];
    secondaryContactIds: number[];
  };
}

export async function contactResponse(
  id: string,
  contacts: IContact[]
): Promise<IdentifyResponse> {
  const response: IdentifyResponse = {
    contact: {
      primaryContactId: id,
      emails: [],
      phoneNumbers: [],
      secondaryContactIds: [],
    },
  };

  const responseEmails = new Set<string>([]);
  const responsePhoneNumbers = new Set<string>([]);

  contacts.map((c) => {
    responseEmails.add(c.email);
    responsePhoneNumbers.add(c.phoneNumber);
    if (c.linkPrecedence === "secondary") {
      response.contact.secondaryContactIds.push(c._id);
    }
  });
  response.contact.emails = Array.from(responseEmails);
  response.contact.phoneNumbers = Array.from(responsePhoneNumbers);

  return response;
}

export interface SecondaryContact {
  email?: string;
  phoneNumber?: string;
  linkedId: string;
  linkPrecedence: "primary" | "secondary";
}

export async function updateSecondaryContact(
  contact: IContact
): Promise<SecondaryContact> {
  const secondaryContact: SecondaryContact = {
    email: contact.email,
    phoneNumber: contact.phoneNumber,
    linkedId:
      contact.linkPrecedence === "primary" ? contact._id : contact.linkedId,
    linkPrecedence: "secondary",
  };
  return secondaryContact;
}
