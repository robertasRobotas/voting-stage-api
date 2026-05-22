import { nanoid } from 'nanoid';
import mongoose from 'mongoose';
import { ForbiddenError, NotFoundError, ValidationError } from '../../common/errors/index.js';
import { VotingStatus } from '../../common/constants/enums.js';
import * as votingRepo from './voting.repository.js';
import type { IVoting } from './voting.schema.js';
import type { CreateVotingInput, UpdateSettingsInput } from './voting.schemas.js';

export async function createVoting(
  ownerId: string,
  ownerEmail: string,
  input: CreateVotingInput,
): Promise<IVoting> {
  return votingRepo.create({
    title: input.title,
    description: input.description,
    ownerId: new mongoose.Types.ObjectId(ownerId),
    ownerEmail: ownerEmail.toLowerCase(),
    status: VotingStatus.OPEN,
    access: input.access,
    invitedEmails: input.invitedEmails.map((e) => e.toLowerCase()),
    items: input.items.map((it, idx) => ({
      id: nanoid(8),
      title: it.title,
      imageUrl: it.imageUrl,
      order: idx,
    })),
  });
}

export async function listMyVotings(ownerId: string): Promise<IVoting[]> {
  return votingRepo.listByOwner(ownerId);
}

export async function getByShareId(shareId: string): Promise<IVoting> {
  const v = await votingRepo.findByShareId(shareId);
  if (!v) throw new NotFoundError('Voting not found', 'VOTING_NOT_FOUND');
  return v;
}

export async function getById(id: string): Promise<IVoting> {
  const v = await votingRepo.findByIdOrShareId(id);
  if (!v) throw new NotFoundError('Voting not found', 'VOTING_NOT_FOUND');
  return v;
}

function assertOwner(v: IVoting, userId: string): void {
  if (v.ownerId.toString() !== userId) {
    throw new ForbiddenError('Only the creator can perform this action', 'NOT_OWNER');
  }
}

export async function finish(id: string, userId: string): Promise<IVoting> {
  const v = await getById(id);
  assertOwner(v, userId);
  v.status = VotingStatus.FINISHED;
  v.finishedAt = new Date();
  await v.save();
  return v;
}

export async function resume(id: string, userId: string): Promise<IVoting> {
  const v = await getById(id);
  assertOwner(v, userId);
  v.status = VotingStatus.OPEN;
  v.finishedAt = undefined;
  await v.save();
  return v;
}

export async function updateSettings(
  id: string,
  userId: string,
  input: UpdateSettingsInput,
): Promise<IVoting> {
  const v = await getById(id);
  assertOwner(v, userId);
  if (input.title !== undefined) v.title = input.title;
  if (input.description !== undefined) v.description = input.description;
  if (input.access !== undefined) v.access = input.access;
  if (input.invitedEmails !== undefined) {
    v.invitedEmails = input.invitedEmails.map((e) => e.toLowerCase());
  }
  await v.save();
  return v;
}

export async function addItem(
  id: string,
  userId: string,
  input: { title: string; imageUrl?: string },
): Promise<IVoting> {
  const v = await getById(id);
  assertOwner(v, userId);
  if (v.status === VotingStatus.FINISHED) {
    throw new ValidationError('Cannot modify items of a finished voting');
  }
  v.items.push({
    id: nanoid(8),
    title: input.title,
    imageUrl: input.imageUrl,
    order: v.items.length,
  });
  await v.save();
  return v;
}

export async function updateItem(
  id: string,
  userId: string,
  itemId: string,
  input: { title?: string; imageUrl?: string },
): Promise<IVoting> {
  const v = await getById(id);
  assertOwner(v, userId);
  const item = v.items.find((i) => i.id === itemId);
  if (!item) throw new NotFoundError('Item not found', 'ITEM_NOT_FOUND');
  if (input.title !== undefined) item.title = input.title;
  if (input.imageUrl !== undefined) item.imageUrl = input.imageUrl;
  await v.save();
  return v;
}

export async function removeItem(id: string, userId: string, itemId: string): Promise<IVoting> {
  const v = await getById(id);
  assertOwner(v, userId);
  v.items = v.items.filter((i) => i.id !== itemId);
  v.items.forEach((i, idx) => (i.order = idx));
  await v.save();
  return v;
}
