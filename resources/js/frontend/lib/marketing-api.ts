function csrfToken(): string {
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : '';
}

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-XSRF-TOKEN': csrfToken(),
    },
    credentials: 'same-origin',
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    const message =
      data?.message ??
      (data?.errors ? Object.values(data.errors).flat().join(' ') : 'Request failed');
    throw new Error(String(message));
  }

  return data as T;
}

export type ContactPayload = {
  name: string;
  phone: string;
  email?: string;
  message?: string;
  subject: 'message' | 'order' | 'corporate';
  metadata?: Record<string, unknown>;
};

export type AppointmentPayload = {
  guest_name: string;
  guest_phone: string;
  guest_email?: string;
  appointment_date: string;
  notes?: string;
};

export function submitContact(payload: ContactPayload) {
  return postJson<{ success: boolean; message: string }>('/api/contact/create', payload);
}

export function submitAppointment(payload: AppointmentPayload) {
  return postJson<{ success: boolean; message: string }>('/api/appointment/create', payload);
}
