import type { Lesson } from '@/types/course';

export const lesson5PowerRequirementsAndSafety: Lesson = {
  id: 5,
  title: 'Power Requirements and Safety',
  duration: '60 minutes',
  type: 'video',
  content: {
    videoUrl: 'https://www.youtube.com/watch?v=cRohQMz8w_o',
    textContent: `<div class="lesson-content">
<h1>Power Requirements and Safety</h1>
<p>This lesson focuses on safe power practices for smart home installations, including load limits, correct wiring, circuit protection, and when to use a qualified electrician.</p>

<h2>Key Safety Principles</h2>
<ul>
  <li><strong>Isolate power</strong> at the breaker before working on any circuit.</li>
  <li><strong>Verify dead</strong> using a voltage tester before touching conductors.</li>
  <li><strong>Use correct ratings</strong> (voltage, current, wattage) for switches, relays, and power supplies.</li>
  <li><strong>Use proper enclosures</strong> and strain relief to prevent exposed connections.</li>
  <li><strong>Follow local electrical codes</strong> and manufacturer instructions.</li>
</ul>

<h2>Power Requirements</h2>
<ul>
  <li><strong>Smart switches/relays</strong>: confirm neutral requirements, max load (e.g. 10A), and compatibility with LED loads.</li>
  <li><strong>Power supplies</strong> (12V/24V): size for peak load plus headroom (e.g. +20%).</li>
  <li><strong>PoE devices</strong>: ensure your switch/injector supports the required PoE standard (802.3af/at) and budget.</li>
</ul>

<h2>Common Hazards</h2>
<ul>
  <li>Overloading a relay/switch leading to overheating.</li>
  <li>Loose terminals causing arcing.</li>
  <li>Incorrect neutral/live connections.</li>
  <li>Mixing low-voltage and mains wiring without separation.</li>
</ul>

<h2>When to Call a Professional</h2>
<ul>
  <li>New circuits, distribution board work, or uncertain wiring conditions.</li>
  <li>Repeated tripping breakers or signs of heat damage.</li>
  <li>Compliance certificate requirements.</li>
</ul>
</div>`
  }
};
