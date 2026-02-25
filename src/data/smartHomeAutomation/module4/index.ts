import type { Module } from '@/types/course';
import { lesson1InstallingSmartDevices } from './lesson1-installing-smart-devices';
import { lesson2WiringBasicsForSmartSwitchesAndRelays } from './lesson2-wiring-basics-for-smart-switches-and-relays';
import { lesson3AppSetup } from './lesson3-app-setup';
import { lesson4QrCodePairingDeviceNamingAndRoomMapping } from './lesson4-qr-code-pairing-device-naming-and-room-mapping';
import { lesson5PowerRequirementsAndSafety } from './lesson5-power-requirements-and-safety';

export const module4: Module = {
  id: 4,
  title: 'Installation of Smart Devices',
  description: 'Comprehensive guide to installing and configuring smart home devices including lights, plugs, thermostats, cameras, switches, and relays with wiring basics, app setup, and safety considerations.',
  lessons: [
    lesson1InstallingSmartDevices,
    lesson2WiringBasicsForSmartSwitchesAndRelays,
    lesson3AppSetup,
    lesson4QrCodePairingDeviceNamingAndRoomMapping,
    lesson5PowerRequirementsAndSafety
  ]
};
