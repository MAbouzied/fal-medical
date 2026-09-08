export function servicesForSelectedSpecialty<T extends { specialty: string }>(
  catalog: readonly T[],
  specialty: string,
): T[] {
  const selected = specialty.trim();
  if (!selected) return [];
  return catalog.filter((item) => item.specialty === selected);
}

const catalogs = new WeakMap<HTMLSelectElement, HTMLOptionElement[]>();

function getCatalog(service: HTMLSelectElement): HTMLOptionElement[] {
  const existing = catalogs.get(service);
  if (existing) return existing;

  const options = [...service.querySelectorAll('option')]
    .filter((option) => option.value)
    .map((option) => option.cloneNode(true) as HTMLOptionElement);
  catalogs.set(service, options);
  return options;
}

export function syncServiceOptions(specialty: HTMLSelectElement, service: HTMLSelectElement): void {
  const catalog = getCatalog(service);
  const placeholder =
    [...service.options].find((option) => !option.value)?.cloneNode(true) ?? new Option('', '');
  const previous = service.value;
  const visible = servicesForSelectedSpecialty(
    catalog.map((option) => ({ specialty: option.dataset.specialty ?? '', option })),
    specialty.value,
  );

  service.replaceChildren(placeholder);
  for (const item of visible) {
    service.append(item.option.cloneNode(true) as HTMLOptionElement);
  }

  const canKeep = visible.some((item) => item.option.value === previous);
  service.value = canKeep ? previous : '';
}

export function bindSpecialtyServiceFields(root: ParentNode = document): void {
  root.querySelectorAll<HTMLSelectElement>('[data-specialty-select]').forEach((specialty) => {
    if (specialty.dataset.cascadeBound === 'true') return;
    const form = specialty.form ?? specialty.closest('form');
    const service = form?.querySelector<HTMLSelectElement>('[data-service-select]');
    if (!service) return;

    specialty.dataset.cascadeBound = 'true';
    const apply = () => syncServiceOptions(specialty, service);
    specialty.addEventListener('change', apply);
    apply();
  });
}
