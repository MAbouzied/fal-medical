import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { getServiceById } from '../data/services.ts';
import {
  buildFaqSchema,
  buildGraph,
  buildItemListSchema,
  buildMedicalProcedureSchema,
  buildOrganizationSchema,
  buildReserveAction,
  buildWebPageSchema,
  itemListId,
  medicalSpecialtyUrl,
} from './schema.ts';

const site = new URL('https://falclinic.com');

describe('clinic JSON-LD', () => {
  it('uses MedicalClinic instead of an education organization', () => {
    const graph = buildGraph(site, [], 'ar');
    const nodes = graph['@graph'] as Array<Record<string, unknown>>;
    const types = nodes.map((node) => node['@type']);
    assert.ok(types.includes('MedicalClinic'));
    assert.ok(types.includes('WebSite'));
    assert.equal(types.includes('EducationalOrganization'), false);
    assert.equal(types.includes('Course'), false);
    assert.equal(types.includes('EducationEvent'), false);
  });

  it('links a collection page to its item list', () => {
    const listId = itemListId(site, '/services');
    const page = buildWebPageSchema({
      site,
      path: '/services',
      name: 'الخدمات',
      description: 'قائمة الخدمات',
      type: 'CollectionPage',
      mainEntityId: listId,
    });
    const list = buildItemListSchema({
      site,
      path: '/services',
      name: 'خدمات فال',
      description: 'قائمة الخدمات',
      itemType: 'Service',
      items: [{ name: 'زراعة الأسنان', path: '/services/dental-implants' }],
    });

    assert.equal(page['@type'], 'CollectionPage');
    assert.deepEqual(page.mainEntity, { '@id': listId });
    assert.equal(list['@id'], listId);
    assert.equal(list.inLanguage, 'ar');
  });

  it('describes a treatment as a medical procedure without a price or rating', () => {
    const service = getServiceById('dental-implants');
    assert.ok(service);
    const procedure = buildMedicalProcedureSchema(site, service, 'ar');
    assert.equal(procedure['@type'], 'MedicalProcedure');
    assert.equal(procedure.relevantSpecialty, 'https://schema.org/Dentistry');
    assert.equal(procedure.offers, undefined);
    assert.equal(procedure.aggregateRating, undefined);
    assert.match(String(procedure.howPerformed), /فحص وأشعة/);
  });

  it('maps dermatology to the dermatology specialty', () => {
    assert.equal(medicalSpecialtyUrl('جلدية'), 'https://schema.org/Dermatology');
    assert.equal(medicalSpecialtyUrl('أسنان'), 'https://schema.org/Dentistry');
  });

  it('adds a reserve action for appointment pages', () => {
    const action = buildReserveAction(site, 'en');
    const page = buildWebPageSchema({
      site,
      path: '/en/book',
      name: 'Book',
      description: 'Book a visit',
      locale: 'en',
      potentialAction: action,
    });
    assert.equal(action['@type'], 'ReserveAction');
    assert.equal(page.potentialAction, action);
    assert.match(JSON.stringify(action), /https:\/\/falclinic.com\/en\/book/);
  });

  it('strips markup from FAQ answers', () => {
    const schema = buildFaqSchema([
      { question: 'سؤال', answer: 'جواب <b>واضح</b>' },
    ]);
    const questions = schema.mainEntity as Array<{ acceptedAnswer: { text: string } }>;
    assert.equal(questions[0]?.acceptedAnswer.text, 'جواب واضح');
  });

  it('keeps the organization graph free of course offers', () => {
    const organization = buildOrganizationSchema(site, 'ar');
    const serialized = JSON.stringify(organization);
    assert.equal(serialized.includes('Course'), false);
    assert.equal(serialized.includes('EducationalOrganization'), false);
    assert.equal(organization['@type'], 'MedicalClinic');
  });
});
