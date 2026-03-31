const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://bharath-reddy-ai-career-ai.hf.space";

export async function checkHealth() {
  const res = await fetch(`${BASE_URL}/`);
  return res.json();
}

export async function getRelevanceScore(resumeFile: File, jdFile: File) {
  const form = new FormData();
  form.append("resume", resumeFile);
  form.append("JD", jdFile);
  const res = await fetch(`${BASE_URL}/get-relevence-score`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function getCareerRoadmap(
  resumeFile: File,
  jobRole: string,
  hours: number
) {
  const form = new FormData();
  form.append("resume", resumeFile);
  form.append("Jobrole", jobRole);
  form.append("hours", hours.toString());
  const res = await fetch(`${BASE_URL}/Career-roadmap`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function getDsaConfig() {
  const res = await fetch(`${BASE_URL}/DsaConfig`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function getDsaList(targetCompany: string) {
  const res = await fetch(
    `${BASE_URL}/Dsalist?target_company=${encodeURIComponent(targetCompany)}`
  );
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function getDsaRoadmap(
  leetcodeUrl: string,
  targetCompany: string,
  timePeriod: number
) {
  const params = new URLSearchParams({
    leetcode_public: leetcodeUrl,
    user_target_company: targetCompany,
    time_period_for_interview: timePeriod.toString(),
  });
  const res = await fetch(`${BASE_URL}/DSA-roadmap?${params}`, {
    method: "POST",
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}
