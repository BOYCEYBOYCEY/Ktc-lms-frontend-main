 # CLAUDE.md: School LMS Demo

## 1. What we are building

A **demo-only React application** for an AI-powered LMS (Learning Management System) aimed at **private K-12 schools in India (CBSE / ICSE / State board)**. The long-term goal is to sell a real product to schools. The immediate goal is to win over **one principal in a live demo on 12 Nov 2026**.

This is a clickable, realistic prototype, **not** a production system.

## 2. Who I am (the developer)

- Java backend developer (Spring Boot, microservices). **Little to no frontend experience.**
- Working full-time, so limited hours per day. Time is the scarcest resource.
- Prefer concise, direct communication.

### How to work with me

- Explain frontend concepts in one or two sentences when you introduce them. Don't assume I know React patterns, Tailwind, or CSS.
- Give me exact commands to run, and tell me what I should see when it works.
- Keep changes small and runnable at every step. After each task, the app should still start.
- Don't add features, libraries, or abstractions I didn't ask for. Ask before expanding scope.
- Prefer boring, standard solutions over clever ones.

## 3. Audience and positioning

- **Demo audience:** the principal / owner of a private K-12 school. They care about outcomes: happy parents, better results, less teacher burnout, visibility across the school.
- **Assumption (not confirmed):** the school currently has no software and runs on paper, registers, and WhatsApp groups. We are replacing paper, not competing with Moodle or Google Classroom.
- **Not yet known:** the principal's real pain points. A discovery conversation has not happened, so treat the feature priorities below as informed guesses.
- **Differentiator vs generic LLMs (e.g. ChatGPT):** AI that works on the school's own data (students, marks, attendance, syllabus), with teacher approval and role-based views. Every feature should show this.

## 4. Problems the product solves

1. **Teacher workload:** lesson plans, quizzes, grading help, report-card remarks.
2. **Parent communication:** simple progress updates, AI summaries, Hindi/English.
3. **Student performance tracking:** early warning for students falling behind.

## 5. Demo scope

### Roles (switch via dropdown, no real login)

Principal, Teacher, Parent.

### Hero flows (build these fully, with polish)

1. **Principal dashboard:** school-wide attendance, class performance trends, **at-risk students list with reasons** (e.g. "marks down 20% in 2 months, absent 6 days"), teacher activity.
2. **Teacher flows:** quick attendance marking, marks entry, AI lesson plan / quiz generator (board-aligned), AI-assisted grading feedback with teacher approval, auto-drafted report-card remarks.
3. **Parent view:** child progress page, plain-language AI summary (e.g. "Riya improved in Maths but needs help with Hindi writing"), Hindi/English toggle, WhatsApp-style notification preview.
4. **Closing flow (the wow moment):** click an at-risk student on the principal dashboard, then show the intervention flowing to a teacher task and a parent message.

### Secondary screens (simple, realistic fake data, lower priority)

Fees, announcements, timetable, and an "import students from Excel" onboarding screen (can be a mock). They exist so the sidebar looks complete. Build them last.

### Out of scope

Real login/auth, real backend or database, real payments, real WhatsApp integration, anything not listed above.

## 6. Technical decisions

- **Stack:** React + Vite, Tailwind CSS, shadcn/ui components. Add a charting library (e.g. Recharts) only for dashboard charts.
- **Data:** all data is mock JSON in a `src/data/` folder. No API calls.
- **AI features:** hardcode realistic outputs for the demo. Make them feel live (loading state, short typing/streaming effect). At most one real LLM call, and only if time allows.
- **Responsive:** must look good on a laptop screen first; mobile-friendly for the parent view.
- **Later:** a Spring Boot backend may replace the mock data after a school signs. Keep data access behind small functions (e.g. `getStudents()`) so swapping later is easy.

### Suggested structure

```
src/
	components/    reusable UI pieces
	pages/         one file per screen (principal/, teacher/, parent/)
	data/          mock JSON (students, marks, attendance, teachers)
	lib/           helpers (data access, formatting, fake AI outputs)
```

## 7. Mock data guidelines

Realistic data is what makes the demo convincing.

- One invented school with a believable name, classes from a CBSE-style layout (e.g. Class 6 to 10), sections A/B.
- 10 to 15 core students with believable Indian names, with marks across subjects (Maths, Science, English, Hindi, Social Science) and attendance percentages.
- Include **3 to 4 clearly at-risk students** with a visible trend (marks dropping, attendance slipping) so the dashboard has a story.
- A handful of teachers mapped to subjects and classes.
- Keep data consistent across screens: a student's marks on the teacher screen must match the principal dashboard and the parent view.

## 8. Plan (demo on 12 Nov 2026)

| Dates | Focus |
|---|---|
| Nov 2-3 | Setup, layout, sidebar, role switcher, mock data |
| Nov 4-5 | Principal dashboard (hero screen) |
| Nov 6-8 | Teacher flows: attendance, marks, AI generator |
| Nov 9-10 | Parent view, AI summary, closing flow |
| Nov 11 | Polish, secondary screens, rehearsal. **No new features.** |
| Nov 12 | Demo |

### Rules

1. **Hero flows first.** If time slips, drop secondary screens, never hero ones.
2. No login and no backend. A role-switch dropdown is enough.
3. Realistic data over more features.
4. Nov 11 is for polish and rehearsal only.

## 9. Definition of done (per screen)

- Runs without console errors.
- Uses consistent mock data.
- Has sensible empty/loading states where relevant.
- Looks clean at laptop width, with no overflow or broken layout.
- I can click through it without hitting a dead end.

## 10. Open questions to resolve with me

- The principal's actual pain points (no discovery conversation yet).
- The school's size, current tools, and what they might pay.
- Whether to add one live LLM call to the demo.
