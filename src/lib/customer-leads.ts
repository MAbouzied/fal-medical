export interface CustomerLead {
  name: string;
  phone: string;
  department: string;
  service: string;
  locale: 'ar' | 'en';
  consent: boolean;
  website?: string;
}

export type SaveCustomerLeadResult =
  | { ok: true; saved: true; whatsappUrl?: string }
  | { ok: false; saved: false; status: number; whatsappUrl?: string };

export async function saveCustomerLead(lead: CustomerLead): Promise<SaveCustomerLeadResult> {
  const response = await fetch('/api/customers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    credentials: 'same-origin',
    keepalive: true,
    body: JSON.stringify(lead),
  });

  const payload = (await response.json().catch(() => ({}))) as {
    ok?: boolean;
    saved?: boolean;
    whatsappUrl?: string;
  };

  if (!response.ok || payload.ok === false) {
    return {
      ok: false,
      saved: false,
      status: response.status,
      whatsappUrl: typeof payload.whatsappUrl === 'string' ? payload.whatsappUrl : undefined,
    };
  }

  return {
    ok: true,
    saved: true,
    whatsappUrl: typeof payload.whatsappUrl === 'string' ? payload.whatsappUrl : undefined,
  };
}
