import { client } from "./wix-client.mjs";

let activeEvent = null;
let seasonRegistrationEvent = null;

export function splitName(full) {
  const parts = (full || "").trim().split(/\s+/);
  return {
    firstName: parts[0] || "Member",
    lastName: parts.slice(1).join(" ") || "Racer",
  };
}

function eventId(ev) {
  return ev?._id || ev?.id;
}

export async function fetchUpcomingEvents(limit = 20) {
  const result = await client.wixEventsV2.queryEvents({ limit });
  return result.events || result.items || [];
}

/** Primary season signup event — Mail-Off or first open RSVP fixture. */
export function pickSeasonRegistrationEvent(events) {
  return (
    events.find((e) => /mail-off/i.test(e.title || ""))
    || events.find((e) => {
      const type = e.registration?.initialType || e.registration?.type;
      return type === "RSVP" && /season/i.test(e.title || "");
    })
    || events.find((e) => (e.registration?.initialType || e.registration?.type) === "RSVP")
    || null
  );
}

async function prefillMemberFields(nameEl, emailEl) {
  if (!client.auth.loggedIn() || !nameEl || !emailEl) return;
  try {
    const { getCurrentMember } = await import("./wix-members.mjs");
    const { member } = await getCurrentMember({ fieldsets: ["FULL"] });
    const nick = member?.profile?.nickname || "";
    const loginEmail = member?.loginEmail || "";
    if (nick) nameEl.value = nick;
    if (loginEmail) emailEl.value = loginEmail;
  } catch {
    /* optional prefill */
  }
}

async function prefillGuest() {
  const first = document.getElementById("rsvpFirst");
  const last = document.getElementById("rsvpLast");
  const email = document.getElementById("rsvpEmail");
  if (!client.auth.loggedIn()) return;
  try {
    const { getCurrentMember } = await import("./wix-members.mjs");
    const { member } = await getCurrentMember({ fieldsets: ["FULL"] });
    const nick = member?.profile?.nickname || "";
    const loginEmail = member?.loginEmail || "";
    if (nick) {
      const { firstName, lastName } = splitName(nick);
      if (first) first.value = firstName;
      if (last) last.value = lastName;
    }
    if (email && loginEmail) email.value = loginEmail;
  } catch {
    /* optional prefill */
  }
}

async function prefillRegForm() {
  await prefillMemberFields(
    document.getElementById("f-name"),
    document.getElementById("f-email"),
  );
}

async function createEventRsvp(ev, { firstName, lastName, email, extraInputValues = [] }) {
  const id = eventId(ev);
  if (!id) throw new Error("Event not available for registration.");

  const body = { eventId: id, firstName, lastName, email, status: "YES" };
  if (extraInputValues.length) {
    body.form = { inputValues: extraInputValues };
  }

  try {
    return await client.rsvpV2.createRsvp(body);
  } catch (ex) {
    if (extraInputValues.length) {
      const { form, ...rest } = body;
      return await client.rsvpV2.createRsvp(rest);
    }
    throw ex;
  }
}

export function openRsvpModal(event) {
  activeEvent = event;
  const modal = document.getElementById("rsvpModal");
  const title = document.getElementById("rsvpEventTitle");
  const form = document.getElementById("rsvpForm");
  const ok = document.getElementById("rsvpSuccess");
  if (!modal || !form) return;
  if (title) title.textContent = event.title || "Event registration";
  form.hidden = false;
  if (ok) ok.hidden = true;
  prefillGuest();
  modal.showModal?.();
}

async function submitRsvp(e) {
  e.preventDefault();
  if (!activeEvent) return;
  const firstName = document.getElementById("rsvpFirst")?.value.trim();
  const lastName = document.getElementById("rsvpLast")?.value.trim();
  const email = document.getElementById("rsvpEmail")?.value.trim();
  const err = document.getElementById("rsvpErr");
  const form = document.getElementById("rsvpForm");
  const ok = document.getElementById("rsvpSuccess");
  if (err) { err.hidden = true; err.textContent = ""; }
  try {
    const rsvp = await createEventRsvp(activeEvent, { firstName, lastName, email });
    if (form) form.hidden = true;
    if (ok) {
      ok.hidden = false;
      ok.textContent = rsvp?.status === "WAITLIST"
        ? "You are on the waitlist. We will write when a seat opens — no rush."
        : "RSVP confirmed. Your name is on the register. See you at the mail-off.";
    }
  } catch (ex) {
    if (err) {
      err.hidden = false;
      err.textContent = ex?.message || "Registration failed. The window may be closed, or this email is already registered.";
    }
  }
}

async function submitSeasonRegistration(e) {
  e.preventDefault();
  e.stopImmediatePropagation();

  const form = document.getElementById("regForm");
  const success = document.getElementById("formSuccess");
  const err = document.getElementById("regErr");
  if (!form) return;
  if (form.reportValidity?.() === false) return;

  if (err) { err.hidden = true; err.textContent = ""; }

  let ev = seasonRegistrationEvent;
  if (!ev) {
    try {
      ev = pickSeasonRegistrationEvent(await fetchUpcomingEvents());
    } catch {
      /* fall through */
    }
  }
  if (!ev) {
    if (err) {
      err.hidden = false;
      err.textContent = "Season registration is not open yet. Try again after the next mail-off is published.";
    }
    return;
  }

  const fullName = document.getElementById("f-name")?.value.trim();
  const email = document.getElementById("f-email")?.value.trim();
  const country = document.getElementById("f-country")?.value.trim();
  const format = document.getElementById("f-format")?.value.trim();
  const message = document.getElementById("f-msg")?.value.trim();
  const { firstName, lastName } = splitName(fullName);

  const extraInputValues = [];
  if (country) extraInputValues.push({ inputName: "country", value: country });
  if (format) extraInputValues.push({ inputName: "preferred_race_format", value: format });
  if (message) extraInputValues.push({ inputName: "message", value: message });

  try {
    const rsvp = await createEventRsvp(ev, { firstName, lastName, email, extraInputValues });
    form.style.display = "none";
    if (success) {
      success.classList.add("show");
      const note = document.getElementById("formSuccessDetail");
      if (note) {
        const eventTitle = ev.title || "the current season";
        note.textContent = rsvp?.status === "WAITLIST"
          ? `You are waitlisted for ${eventTitle}. We will write when a seat opens.`
          : `You are registered for ${eventTitle}. A league postcard number will follow by post.`;
      }
    }
  } catch (ex) {
    if (err) {
      err.hidden = false;
      err.textContent = ex?.message || "Registration failed. The window may be closed, or this email is already registered.";
    }
  }
}

export async function wireSeasonRegistration(cachedEvents = null) {
  const form = document.getElementById("regForm");
  if (!form) return;

  try {
    const events = cachedEvents ?? await fetchUpcomingEvents();
    seasonRegistrationEvent = pickSeasonRegistrationEvent(events);
    const label = document.getElementById("seasonEventLabel");
    if (label) {
      label.textContent = seasonRegistrationEvent?.title || "the next season mail-off";
    }
  } catch {
    /* static label remains */
  }

  await prefillRegForm();
  form.addEventListener("submit", submitSeasonRegistration, true);
}

export function wireEventRsvp() {
  document.querySelectorAll(".btn-rsvp").forEach((btn) => {
    btn.addEventListener("click", () => {
      openRsvpModal({
        _id: btn.dataset.eventId,
        title: btn.dataset.eventTitle,
      });
    });
  });
  document.getElementById("rsvpForm")?.addEventListener("submit", submitRsvp);
  document.getElementById("rsvpClose")?.addEventListener("click", () => {
    document.getElementById("rsvpModal")?.close?.();
  });
}
