export enum VotingStatus {
  DRAFT = 'DRAFT',
  OPEN = 'OPEN',
  FINISHED = 'FINISHED',
}

/**
 * Who is allowed to cast a vote on a board.
 * - INVITE_ONLY: invited emails must sign in to vote.
 * - LINK: anyone with the link can vote (anonymous voters get a localStorage
 *   token so they can't vote twice from the same browser).
 */
export enum VotingAccess {
  INVITE_ONLY = 'INVITE_ONLY',
  LINK = 'LINK',
}
