import { client } from "./wix-client.mjs";

let activeEvent = null;

function splitName(full) {
  const parts = (full || "").trim().split(/\s+/);
  return {
    firstName: parts[0] || "Member",
    lastName: parts.slice(1).join(" ") || "Racer",
  };
}

async function prefillGuest() {
  const first = document.getElementById("rsvpFirst");
  const last = document.getElementById("rsvpLast");
  const email = document.getElementById("rsvpEmail");
  if (!client.auth.loggedIn()) return;
  try {
    const { member } = await client.members.getCurrentMember({ fieldsets: ["FULL"] });
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
  if (!activeEvent?._id) return;
  const firstName = document.getElementById("rsvpFirst")?.value.trim();
  const lastName = document.getElementById("rsvpLast")?.value.trim();
  const email = document.getElementById("rsvpEmail")?.value.trim();
  const err = document.getElementById("rsvpErr");
  const form = document.getElementById("rsvpForm");
  const ok = document.getElementById("rsvpSuccess");
  if (err) { err.hidden = true; err.textContent = ""; }
  try {
    const rsvp = await client.rsvpV2.createRsvp({
      eventId: activeEvent._id,
      firstName,
      lastName,
      email,
      status: "YES",
    });
    if (form) form.hidden = true;
    if (ok) {
      ok.hidden = false;
      const msg = rsvp?.status === "WAITLIST"
        ? "You are on the waitlist. We will write when a seat opens — no rush."
        : "RSVP confirmed. Your name is on the register. See you at the mail-off.";
      ok.textContent = msg;
    }
  } catch (ex) {
    if (err) {
      err.hidden = false;
      err.textContent = ex?.message || "Registration failed. The window may be closed, or this email is already registered.";
    }
  }
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
