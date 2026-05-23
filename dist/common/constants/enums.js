export var VotingStatus;
(function (VotingStatus) {
    VotingStatus["DRAFT"] = "DRAFT";
    VotingStatus["OPEN"] = "OPEN";
    VotingStatus["FINISHED"] = "FINISHED";
})(VotingStatus || (VotingStatus = {}));
/**
 * Who is allowed to cast a vote on a board.
 * - INVITE_ONLY: invited emails must sign in to vote.
 * - LINK: anyone with the link can vote (anonymous voters get a localStorage
 *   token so they can't vote twice from the same browser).
 */
export var VotingAccess;
(function (VotingAccess) {
    VotingAccess["INVITE_ONLY"] = "INVITE_ONLY";
    VotingAccess["LINK"] = "LINK";
})(VotingAccess || (VotingAccess = {}));
//# sourceMappingURL=enums.js.map