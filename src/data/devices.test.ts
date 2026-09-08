import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { clinicDevices } from './devices.ts';
import { devicesEn } from '../lib/i18n/content-en.ts';

describe('clinic devices', () => {
  it('lists Fal Clinic devices with matching English overlays', () => {
    assert.ok(clinicDevices.length >= 6);
    assert.ok(clinicDevices.some((device) => device.id === 'hydra-beauty'));
    assert.ok(clinicDevices.some((device) => device.id === 'candela-gentlemax-pro'));
    assert.ok(clinicDevices.some((device) => device.id === 'queen-co2'));
    assert.ok(clinicDevices.some((device) => device.id === 'lutronic-spectra-xt'));
    assert.equal(
      clinicDevices.some((device) => device.id === 'curas-qswitched' || device.id === 'preime-dermafacial'),
      false,
    );

    for (const device of clinicDevices) {
      assert.ok(devicesEn[device.id], `missing English overlay for ${device.id}`);
      assert.ok(device.name.trim().length > 0);
      assert.ok(device.description.trim().length > 0);
      assert.equal(device.description.includes('\n'), false, `${device.id} usage must be one line`);
      assert.ok(device.image.startsWith('/assets/devices/'));
      assert.ok(device.imageAlt.trim().length > 0);
    }
  });

  it('uses the Hydra Beauty photo for hydrafacial cleaning', () => {
    const hydra = clinicDevices.find((device) => device.id === 'hydra-beauty');
    assert.ok(hydra);
    assert.equal(hydra.image, '/assets/devices/hydra-beauty.jpg');
    assert.match(hydra.name, /Hydra Beauty/i);
  });
});
