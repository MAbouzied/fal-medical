import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  clinicServices,
  getServiceById,
  homeServiceDepartments,
  serviceCategories,
  serviceDepartmentFromSlug,
  serviceDepartments,
  serviceSectionPath,
  servicesCatalogPath,
} from './services.ts';

const beautyCornerServiceIds = [
  'dental-implants',
  'dental-prosthetics',
  'dental-veneers',
  'teeth-whitening',
  'cleaning-polishing',
  'tooth-extraction',
  'root-canal',
  'cosmetic-fillings',
  'gum-contouring',
  'gum-depigmentation',
  'dental-xray-3d',
  'laser',
  'filler-botox',
  'body-contouring',
  'hydrafacial',
] as const;

describe('clinic services catalog', () => {
  it('uses Beauty Corner service ids, departments, and categories', () => {
    assert.deepEqual([...serviceDepartments], ['كل الخدمات', 'أسنان', 'جلدية']);
    assert.deepEqual([...homeServiceDepartments], ['أسنان', 'جلدية']);
    assert.deepEqual([...serviceCategories], ['كل الخدمات', 'تجميل', 'علاج وجراحة', 'تركيبات وتشخيص']);
    assert.deepEqual(
      clinicServices.map((service) => service.id),
      [...beautyCornerServiceIds],
    );
  });

  it('keeps the Beauty Corner titles, categories, and departments', () => {
    assert.deepEqual(
      clinicServices.map((service) => [service.id, service.title, service.category, service.department]),
      [
        ['dental-implants', 'زراعة الأسنان', 'علاج وجراحة', 'أسنان'],
        ['dental-prosthetics', 'تركيبات الأسنان', 'تركيبات وتشخيص', 'أسنان'],
        ['dental-veneers', 'عدسات الأسنان', 'تركيبات وتشخيص', 'أسنان'],
        ['teeth-whitening', 'تبييض الأسنان', 'تجميل', 'أسنان'],
        ['cleaning-polishing', 'تنظيف وتلميع الأسنان', 'تجميل', 'أسنان'],
        ['tooth-extraction', 'الخلع (جراحي وعادي)', 'علاج وجراحة', 'أسنان'],
        ['root-canal', 'حشوات العصب', 'علاج وجراحة', 'أسنان'],
        ['cosmetic-fillings', 'الحشوات التجميلية', 'تجميل', 'أسنان'],
        ['gum-contouring', 'قص اللثة (جراحي وليزر)', 'علاج وجراحة', 'أسنان'],
        ['gum-depigmentation', 'توريد اللثة بالليزر', 'تجميل', 'أسنان'],
        ['dental-xray-3d', 'أشعة الأسنان 3D', 'تركيبات وتشخيص', 'أسنان'],
        ['laser', 'الليزر', 'تجميل', 'جلدية'],
        ['filler-botox', 'الفيلر والبوتوكس', 'تجميل', 'جلدية'],
        ['body-contouring', 'النحت', 'تجميل', 'جلدية'],
        ['hydrafacial', 'تنظيف البشرة الهيدرافيشل', 'تجميل', 'جلدية'],
      ],
    );
  });

  it('points service urls at detail pages, not collapsed specialty hashes', () => {
    assert.equal(serviceSectionPath('dental-implants'), '/services/dental-implants');
    assert.equal(serviceSectionPath('hydrafacial', 'en'), '/en/services/hydrafacial');
    assert.equal(getServiceById('filler-botox')?.title, 'الفيلر والبوتوكس');
    assert.equal(getServiceById('dentistry'), undefined);
  });

  it('maps catalog nav slugs to department tabs', () => {
    assert.equal(serviceDepartmentFromSlug('dentistry'), 'أسنان');
    assert.equal(serviceDepartmentFromSlug('#skin'), 'جلدية');
    assert.equal(serviceDepartmentFromSlug('all-services'), 'كل الخدمات');
    assert.equal(serviceDepartmentFromSlug('unknown'), undefined);
    assert.equal(servicesCatalogPath('كل الخدمات'), '/services#all-services');
    assert.equal(servicesCatalogPath('أسنان'), '/services?department=dentistry#all-services');
    assert.equal(servicesCatalogPath('جلدية', 'en'), '/en/services?department=skin#all-services');
  });
});
