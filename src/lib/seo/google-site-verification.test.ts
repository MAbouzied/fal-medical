import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  GOOGLE_SITE_VERIFICATION_BODY,
  GOOGLE_SITE_VERIFICATION_PATH,
  googleSiteVerificationResponse,
} from './google-site-verification.ts';

describe('Google site verification file', () => {
  it('serves the .html path with the verification body', async () => {
    const response = googleSiteVerificationResponse(GOOGLE_SITE_VERIFICATION_PATH);
    assert.ok(response);
    assert.equal(response.status, 200);
    assert.equal(await response.text(), GOOGLE_SITE_VERIFICATION_BODY);
    assert.match(response.headers.get('Content-Type') ?? '', /text\/html/);
  });

  it('redirects the extensionless path to the .html file', () => {
    const response = googleSiteVerificationResponse('/googleb1cfedf0fc1535b8');
    assert.ok(response);
    assert.equal(response.status, 301);
    assert.equal(response.headers.get('Location'), GOOGLE_SITE_VERIFICATION_PATH);
  });

  it('redirects a trailing slash to the .html file', () => {
    const response = googleSiteVerificationResponse('/googleb1cfedf0fc1535b8/');
    assert.equal(response?.status, 301);
    assert.equal(response?.headers.get('Location'), GOOGLE_SITE_VERIFICATION_PATH);
  });

  it('ignores other paths', () => {
    assert.equal(googleSiteVerificationResponse('/sitemap.xml'), null);
  });
});
