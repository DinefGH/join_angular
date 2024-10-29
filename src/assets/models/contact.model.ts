/**
 * Interface representing a contact with essential information for identification and communication.
 */
export interface Contact {

    /** Unique identifier for the contact. */
  id: number;

  /** Full name of the contact. */
  name: string;

    /** Initials of the contact, usually derived from the name. */
  initials: string;

  /** Email address of the contact. */
  email: string;

    /** Phone number of the contact. */
  phone: string;

  /** Display color associated with the contact, represented as a string. */
  color: string;
}
