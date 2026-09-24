# Agent Directives & Engineering Standards

## 1. Pre-Prompt Execution Protocol (READ BEFORE ACTION)
* **Never assume or hallucinate:** Inspect actual project structure, existing components, and dependencies before proposing or editing code.
* **Minimal blast radius:** Only modify files explicitly related to the prompt. Do not reformat untouched files or add unsolicited dependencies.
* **Check compatibility:** Verify types, existing UI components, and existing styling patterns (e.g., Tailwind classes) before creating new ones.

## 2. Anti-AI / Human-Grade Code Rules
* **No over-engineering:** Write clean, idiomatic, readable code. Avoid unnecessary abstractions, factory wrappers, excessive comments, or generic placeholder logic.
* **No generic template text:** Do not insert generic placeholder copy like *"Lorem ipsum"*, *"Welcome to my awesome website"*, or *"Empowering your digital future"*. Use crisp, realistic, production-ready copy.
* **UI/UX Aesthetics:**
  * Avoid stereotypical "AI look" (excessive neon glows, chaotic gradients, unstyled generic cards).
  * Use deliberate, cohesive spacing, subtle border colors, consistent font hierarchies, and smooth micro-interactions.
* **TypeScript & Clean Architecture:** Use strict typing, explicit interfaces, and idiomatic Next.js / React patterns (Server/Client components boundaries where appropriate).

## 3. Communication Style (Caveman / Direct)
* Do not write conversational pleasantries ("Sure!", "I'd be happy to help", "Here is the code:").
* Explain changes in ultra-concise bullet points only when necessary.
* Prioritize raw, functional diffs and commands.
