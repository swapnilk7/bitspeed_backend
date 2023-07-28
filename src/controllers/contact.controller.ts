// contactController.ts
import { Request, Response } from "express";
import Contact, { IContact } from "../models/Contact";
import {
  SecondaryContact,
  contactResponse,
  createNewContact,
  getContacts,
  getContactsById,
  updateContact,
  updateSecondaryContact,
} from "../services/contact.service";

interface IdentifyRequest {
  email?: string;
  phoneNumber?: string;
}

export const identifyContact = async (req: Request, res: Response) => {
  const { email, phoneNumber }: IdentifyRequest = req.body;

  try {
    if (!email && !phoneNumber) {
      return res.status(400).json({ error: "Email or phone number required" });
    }

    let primaryId: string = "";
    let contacts: IContact[] | null = [];
    contacts = await getContacts(email, phoneNumber);

    if (contacts.length === 0) {
      const newContact = await createNewContact(email, phoneNumber);
      primaryId = newContact._id;
    } else if (contacts.length === 1) {
      const foundContact = contacts[0];
      if (
        foundContact.email === email &&
        foundContact.phoneNumber === phoneNumber
      )
        return res.status(400).json({
          data: contacts,
          message: "Contact is existing with same email and phoneNumber",
        });

      const secondaryContact: SecondaryContact = await updateSecondaryContact(
        foundContact
      );
      primaryId = secondaryContact.linkedId;
      if (foundContact.email === email) {
        secondaryContact.phoneNumber = phoneNumber;
      } else {
        secondaryContact.email = email;
      }
      if (email && phoneNumber) await new Contact(secondaryContact).save();
    } else {
      const onlyPrimary = contacts.filter(
        (c) => c.linkPrecedence === "primary"
      );
      if (onlyPrimary.length > 1) {
        let id = onlyPrimary[0]._id;
        primaryId = id;
        onlyPrimary.map(async (pc, index) => {
          if (index > 0) {
            await updateContact(primaryId, pc);
          }
        });
      } else {
        primaryId =
          contacts[0].linkPrecedence === "primary"
            ? contacts[0]._id
            : contacts[0].linkedId;
      }
    }

    contacts = await getContactsById(primaryId);
    const response = await contactResponse(primaryId, contacts);
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
