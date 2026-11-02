# Code Library Comments Plan

How to connect the existing comment feature to the code library, and what to fix first. Not scheduled yet.

## What exists today

The comment feature is built but not rendered anywhere. It lives in `app/codelibrary/components/`:

| File | Lines | What it does |
|---|---|---|
| `CommentSection.tsx` | 844 | The whole UI: comment list, replies, edit/delete, likes, an @mention autocomplete. Takes `{ snippet }`. |
| `useComments.ts` | 98 | Live listener on the comments for one snippet, plus the signed-in user from `localStorage`. |
| `commentActions.ts` | 457 | Add/edit/delete comments and replies, like/unlike, notifications for replies and @mentions. |
| `commentTypes.ts`, `types.ts` | ~110 | `Comment`, `Reply`, `AuthUser` types. |

**Data:**
- Comments are stored in the separate `cse-archive-comments` Firebase project (`utils/CommentsDB.ts`), in Realtime Database at `comments/{snippetId}`, as one `comments` array per snippet.
- Every change rewrites that array inside a `runTransaction`.
- Notifications are written to the `notifications` collection in the code library Firestore.

**Checked and fine:** comment text is HTML-escaped before mentions are highlighted, so the `dangerouslySetInnerHTML` in `CommentSection.tsx` isn't an XSS hole.

## Fix before turning it on

1. **Anyone can post or delete as anyone (blocker).**
   - **The problem:** the author's roll number comes from `localStorage` (`AuthUtils.getUserData()`), and the database rules only check `auth != null`, which is satisfied by an anonymous sign-in. Anyone can edit `localStorage` to post, edit or delete comments as another student, or call the database directly.
   - **The fix:** this is the same problem as step 1 of [restructure-plan.md](restructure-plan.md). Either send writes through a server route that checks a real session, or sign users in with Firebase custom tokens that carry their roll (`auth.token.roll`) and make the rules compare it with `authorRoll`.
2. **One array per snippet.**
   - **The problem:** a busy thread retries its transaction on every concurrent write, and one bad write can corrupt the whole thread.
   - **The fix:** store each comment as its own child (`comments/{snippetId}/{commentId}`, with replies under it), so the rules can check each comment's author and a write only touches one comment.
   - **Migrating:** do it before launch, while there's little or no data. A one-off script can move any existing arrays.
3. **A fourth Firebase project.** Comments add another sign-in and another set of rules. If restructure step 6 (merge the Firebase projects) happens first, comments move into the shared project and get the same user ID as everything else.

## Steps

Each step can ship on its own, except that step 5 must be done before step 6 makes comments public.

1. **Move and convert.** Move the files to `features/codelibrary/comments/` and split `CommentSection.tsx`:
   - `CommentList` and `CommentItem` (server-renderable where possible)
   - `CommentForm` and `MentionInput` (client)
   - `useComments` (client)

   Delete `types/comment.ts` if nothing else uses it.
2. **Restyle with the design system.**
   - Use `Textarea`, `Button`, `Badge` and `EmptyState` from `components/ui`, plus lucide icons instead of Font Awesome. The 74 raw `gray`/`blue`/`indigo` classes become tokens.
   - Animations: new comments and replies fade in (`motion-safe:animate-pop-in`), and likes reuse the heart pop from `LikeButton`.
   - Keep the reduced-motion rule.
3. **Render on the detail page.**
   - Add a "Comments" section under the code on `/codelibrary/[id]`.
   - Server-render the first page of comments from the Realtime DB REST API, as `features/codelibrary/server.ts` does for snippets, so they're in the HTML. Then hand over to the live listener in the browser.
   - Signed-out visitors see the comments and a "Log in to comment" button instead of the form.
4. **Show counts in the list.** Add a comment count next to likes and copies on `SnippetCard`, linking to `/codelibrary/<id>#comments`. Fetch the counts on the server in one read. Don't open a listener per card.
5. **Fix identity and rules.** Do "Anyone can post or delete as anyone" and "One array per snippet" from the section above. Test that a user can't edit or delete another user's comment, even by calling the database directly.
6. **Turn it on.** Make sure notifications for replies and @mentions still arrive (`commentActions.ts` `notify` / `notifyMentions`), then ship.

## Tests to add

- `normalizeComments` / `normalizeReply`: old array shapes, missing fields, `likedBy` as an array or a map.
- Mention parsing: `@Name(roll)` is highlighted, and HTML in comment text stays escaped.
- Rules: another user's edit, delete or like-on-behalf is denied (Firebase emulator).

## Decisions needed

- Server route or custom tokens for comment identity (see "Anyone can post or delete as anyone").
- Whether to wait for the Firebase project merge (restructure step 6) or keep comments in `cse-archive-comments`.
- Whether comments need moderation (report or hide) before launch.
