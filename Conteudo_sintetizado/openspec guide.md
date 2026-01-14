1. The OpenSpec Workflow
OpenSpec is a "Spec-Driven Development" framework. Instead of jumping straight into code, we agree on what we are building (Specs) first.

The workflow has 3 distinct stages:

Stage 1: Proposal (Planning)
When you ask for a new feature or complex change:

I Scaffold: I create a new folder openspec/changes/<change-id>/ containing:
proposal.md
 (The "Why" and "What")
tasks.md
 (Implementation checklist)
specs/.../spec.md (The specific requirements we are adding/changing)
You Review: I pause and ask you to review these documents. This is our contract.
I Validate: I run openspec validate <id> --strict to ensure the spec is logically sound.
Stage 2: Implementation (Execution)
Once you approve the specific proposal:

I Execute: I work through the 
tasks.md
 checklist.
I Verify: I implement code to meet the requirements defined in the spec deltas.
Stage 3: Archiving (Completion)
After the feature is built and working:

I Archive: I run openspec archive, which moves the change to a permanent record and updates the "Source of Truth" in the openspec/specs/ folder.
2. How to Work With Me
To get the best results, use this pattern:

To Start: Tell me what you want (e.g., "Plan a change to add user profiles").
I will switch to PLANNING mode and generate a proposal.
To Review: Check the proposal.md and spec.md files I generate.
Tell me "Approved" or give feedback like "The user shouldn't be able to delete their own account."
To Build: Once approved, tell me to "Proceed" or "Implement strictly".
I will switch to EXECUTION mode and write the code.
To Finish: Ask me to "Archive the change".
I will update the permanent documentation.
Key Rule: Specs are the Truth. If you want to change how the system works, we update the Spec first (via a new Change Proposal), then the Code.