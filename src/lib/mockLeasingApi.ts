/**
 * Mock POST to Т-Лизинг. Replace with real fetch when API is available.
 */
export async function submitLeasingApplication(payload: {
  inn: string;
  phone: string;
  comment: string;
}): Promise<{ applicationId: string }> {
  await new Promise((r) => setTimeout(r, 650));
  const applicationId = `TL-${Date.now().toString(36).toUpperCase().slice(-10)}`;
  void payload;
  return { applicationId };
}
