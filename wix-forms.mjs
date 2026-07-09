import { createClient, OAuthStrategy } from "https://esm.sh/@wix/sdk@1.15.24";
import { submissions } from "https://esm.sh/@wix/forms@1.0.150";
import { cfg } from "./wix-client.mjs";

const formsClient = createClient({
  modules: { submissions },
  auth: OAuthStrategy({ clientId: cfg.clientId }),
});

export function wireInquiryForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    e.stopImmediatePropagation();
    if (form.reportValidity?.() === false) return;
    const data = {
      full_name: document.getElementById("c-name").value.trim(),
      email: document.getElementById("c-email").value.trim(),
      country: document.getElementById("c-country")?.value.trim() || "—",
      preferred_race_format: "General inquiry",
      message: document.getElementById("c-msg").value.trim(),
    };
    try {
      await formsClient.submissions.createSubmission({
        formId: cfg.form.formId,
        submissions: data,
      });
      form.style.display = "none";
      document.getElementById("contactSuccess")?.classList.add("show");
    } catch (err) {
      console.error("Inquiry submit failed", err);
      alert("Submission failed. Please try again.");
    }
  }, true);
}
