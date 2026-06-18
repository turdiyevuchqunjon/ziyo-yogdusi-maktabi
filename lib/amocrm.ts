// AmoCRM'ga lead yuborish (long-lived token bilan)

interface LeadData {
  name: string;
  phone: string;
  grade: string;
  sourceUrl?: string;
}

export async function sendToAmoCrm(lead: LeadData): Promise<{ ok: boolean; leadId?: number; error?: string }> {
  const subdomain = process.env.AMOCRM_SUBDOMAIN;
  const token = process.env.AMOCRM_TOKEN;

  if (!subdomain || !token) {
    return { ok: false, error: 'AmoCRM credentials not configured' };
  }

  const leadName = `${lead.name} — ${lead.grade}-sinf`;

  const payload = [
    {
      name: leadName,
      _embedded: {
        contacts: [
          {
            name: lead.name,
            custom_fields_values: [
              {
                field_code: 'PHONE',
                values: [
                  {
                    value: lead.phone,
                    enum_code: 'WORK',
                  },
                ],
              },
            ],
          },
        ],
      },
    },
  ];

  try {
    const res = await fetch(`https://${subdomain}.amocrm.ru/api/v4/leads/complex`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      return { ok: false, error: `AmoCRM ${res.status}: ${text}` };
    }

    const data = await res.json();
    const leadId = Array.isArray(data) ? data[0]?.id : undefined;

    return { ok: true, leadId };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Unknown AmoCRM error' };
  }
}
