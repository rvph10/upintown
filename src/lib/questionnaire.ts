import type { AstroGlobal } from "astro";
import { business } from "../data/business";
import type { Locale } from "../data/i18n";
import { answerLimit, questions } from "../data/questionnaire";
import { claimToken, clientIp, isOverSendLimit, isRateLimited, releaseToken, send, type FieldError } from "./contact";
import { questionnaireConfirmationEmail, questionnaireNotificationEmail } from "./email";

export type Answers = Record<string, string>;
export type AnswerErrors = Partial<Record<string, FieldError>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function readAnswers(data: FormData): Answers {
  const answers: Answers = {};
  for (const question of questions) {
    const value = String(data.get(question.id) ?? "").trim();
    if (question.kind === "choice") {
      answers[question.id] = question.options?.some((option) => option.value === value) ? value : "";
    } else {
      // Only long answers keep line breaks: the others end up in an email header or a single table row.
      answers[question.id] = question.kind === "long" ? value : value.replace(/[\r\n]+/g, " ");
    }
  }
  return answers;
}

export function validateAnswers(answers: Answers): AnswerErrors {
  const errors: AnswerErrors = {};
  for (const question of questions) {
    const value = answers[question.id];
    if (value.length > answerLimit(question)) errors[question.id] = "tooLong";
    else if (question.required && !value) errors[question.id] = "required";
    else if (question.kind === "email" && value && !emailPattern.test(value)) errors[question.id] = "invalid";
  }
  return errors;
}

export type QuestionnaireState = {
  answers: Answers;
  errors: AnswerErrors;
  status: "idle" | "sent" | "failed" | "limited";
  token: string;
};

export async function handleQuestionnaire(astro: AstroGlobal, locale: Locale): Promise<QuestionnaireState | Response> {
  const { request, url } = astro;
  if (request.method !== "POST") {
    return {
      answers: readAnswers(new FormData()),
      errors: {},
      status: url.searchParams.has("sent") ? "sent" : "idle",
      token: crypto.randomUUID(),
    };
  }

  let data: FormData;
  try {
    data = await request.formData();
  } catch {
    return new Response(null, { status: 400 });
  }
  const answers = readAnswers(data);
  const token = String(data.get("token") ?? "");
  if (data.get("fax")) return astro.redirect(`${url.pathname}?sent`, 303);

  const errors = validateAnswers(answers);
  if (Object.keys(errors).length) return { answers, errors, status: "idle", token };

  if (isRateLimited(clientIp(request, astro.clientAddress))) return { answers, errors, status: "limited", token };
  if (!claimToken(token)) return astro.redirect(`${url.pathname}?sent`, 303);
  if (isOverSendLimit()) {
    releaseToken(token);
    return { answers, errors, status: "failed", token };
  }

  try {
    await send({
      from: `${business.name} <${business.noReplyEmail}>`,
      to: [business.email],
      reply_to: answers.email,
      ...questionnaireNotificationEmail(answers, locale),
    });
  } catch (error) {
    console.error(error);
    releaseToken(token);
    return { answers, errors, status: "failed", token };
  }

  // The answers have arrived: a failed confirmation is only logged. Fixed text only, as for the contact form.
  try {
    await send({
      from: `${business.name} <${business.noReplyEmail}>`,
      to: [answers.email],
      ...questionnaireConfirmationEmail(locale),
      headers: { "Auto-Submitted": "auto-generated" },
    });
  } catch (error) {
    console.error(error);
  }
  return astro.redirect(`${url.pathname}?sent`, 303);
}
