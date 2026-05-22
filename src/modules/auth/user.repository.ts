import { UserModel, type IUser } from './user.schema.js';

export interface FirebaseUserInput {
  firebaseUid: string;
  email: string;
  displayName?: string;
  photoUrl?: string;
}

export async function findOrCreateByFirebase(input: FirebaseUserInput): Promise<IUser> {
  const existing = await UserModel.findOne({ firebaseUid: input.firebaseUid });
  if (existing) {
    // Self-heal email/profile drift on subsequent sign-ins. The first sign-in
    // may have landed before Firebase had a real email (`@noemail.firebase`
    // placeholder) — update once we get a proper one.
    let changed = false;
    if (
      input.email &&
      input.email !== existing.email &&
      (existing.email.endsWith('@noemail.firebase') || !existing.email)
    ) {
      existing.email = input.email;
      changed = true;
    }
    if (input.displayName && existing.displayName !== input.displayName) {
      existing.displayName = input.displayName;
      changed = true;
    }
    if (input.photoUrl && existing.photoUrl !== input.photoUrl) {
      existing.photoUrl = input.photoUrl;
      changed = true;
    }
    if (changed) await existing.save();
    return existing;
  }
  return UserModel.create(input);
}

export async function findById(userId: string): Promise<IUser | null> {
  return UserModel.findById(userId);
}

export async function findByEmail(email: string): Promise<IUser | null> {
  return UserModel.findOne({ email: email.toLowerCase() });
}
