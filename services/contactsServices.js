import * as fs from "node:fs/promises";
import path from "node:path";
import { nanoid } from "nanoid";

const contactsPath = path.resolve("db", "contacts.json");

async function readFile() {
  try {
    const data = await fs.readFile(contactsPath);
    return JSON.parse(data);
  } catch (error) {}
}

async function writeFile(contacts) {
  try {
    const data = await fs.writeFile(
      contactsPath,
      JSON.stringify(contacts, undefined, 2)
    );
    return data;
  } catch (error) {}
}

async function listContacts() {
  const contacts = await readFile();

  return contacts;
}

async function getContactById(contactId) {
  const contacts = await readFile();

  const contact = contacts.find((contact) => contact.id === contactId);

  if (typeof contact === "undefined") return null;

  return contact;
}

async function removeContact(contactId) {
  const contacts = await readFile();

  const contactIndex = contacts.findIndex(
    (contact) => contact.id === contactId
  );

  if (contactIndex === -1) return null;
  const removedContact = contacts[contactIndex];

  contacts.splice(contactIndex, 1);

  await writeFile(contacts);

  return removedContact;
}

async function addContact(name, email, phone) {
  const contacts = await readFile();

  const newContact = {
    id: nanoid(),
    name,
    email,
    phone,
  };

  const updatedContacts = [...contacts, newContact];

  await writeFile(updatedContacts);

  return newContact;
}

async function updateContact(id, body) {
  const contacts = await readFile();

  const index = contacts.findIndex((contact) => contact.id === id);

  if (index === -1) {
    return null;
  }

  const updatedContact = { id, ...contacts[index], ...body };

  contacts[index] = updatedContact;

  await writeFile(contacts);

  return updatedContact;
}

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
