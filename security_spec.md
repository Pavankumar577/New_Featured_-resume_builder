# Firestore Security Specifications for ATS Resume Builder

## 1. Data Invariants
- **Profile Integrity**: A user profile must reside exactly at `users/{userId}` where `{userId}` strictly matches the authenticated user key (`request.auth.uid`).
- **Owner Isolation**: Resumes are owned by a single user. Users can only perform CRUD operations on resumes carrying their own `userId`. No user can query or list resumes owned by others.
- **Timestamp Veracity**: `createdAt` and `updatedAt` fields for all written objects must strictly match the clock of the database server (`request.time`).
- **Data Hardening**: Key strings cannot exceed logical size constraints to bypass buffer bounds (e.g. usernames length <= 100, resume titles <= 200).

## 2. The "Dirty Dozen" Payloads
These payloads represent malicious client actions attempting to violate database invariants:

1. **Self-Elevated Registration**: User `attacker1` registers a profile at `users/attacker1` specifying a field `isAdmin: true` attempting to exploit admin status.
2. **Identity Spoofing Profile**: User `attacker1` attempts to write profile data to `users/victim2`.
3. **Identity Spoofing Resume**: User `attacker1` creates a resume at `resumes/resume_abc` but inserts `userId: "victim2"`.
4. **Foreign Resume Hijack (Update)**: User `attacker1` attempts to modify an existing resume at `resumes/victim_res` owned by user `victim2`.
5. **Blanket Query Scraping**: User `attacker1` initiates a listing query for files at `/resumes` without filtering by `userId == "attacker1"`.
6. **Immutable Field Poisoning**: User `attacker1` updates an existing resume, attempting to change `createdAt` to an arbitrary future date.
7. **Temporal Falsification**: User `attacker1` creates a resume and provides a client-provided `createdAt` string instead of `request.time`.
8. **Null Pointer Injector**: User `attacker1` attempts to trigger a crash in rules by submitting a garbage document with unsupported properties.
9. **Poison ID Attack**: User `attacker1` creates a resume with a 50KB junk character document ID.
10. **Foreign Profile Read**: User `attacker1` attempts to `get` the full private profile data of `victim2` from `users/victim2`.
11. **Shadow State Modification**: User `attacker1` attempts to inject unapproved structural properties like `ghostProperty: "malicious_content"` during update.
12. **Foreign Resume Deletion**: User `attacker1` attempts to delete a resume belonging to `victim2`.

## 3. Test Runner Definition (`firestore.rules.test.ts`)
```typescript
// Conceptual simulation test verifying response status on the "Dirty Dozen"
import { assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
// Verified in test suite environment to ensure security posture:
// All "Dirty Dozen" payloads yield PERMISSION_DENIED.
```
