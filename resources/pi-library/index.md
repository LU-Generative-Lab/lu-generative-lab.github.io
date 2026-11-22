---
layout: default
title: Raspberry Pi Lending Library
description: Borrow a Raspberry Pi 4 from the Generative Lab for a term.
js: /assets/js/pi-library.js
---

# raspberry pi lending library

Acacia has a small stack of Raspberry Pis, and they're more useful in your hands than in her drawer. Borrow one for a term and make something with it.

## what you get

- a **Raspberry Pi 4 Model B** with 4GB of RAM
- a power cable

That's it. **Everything else is up to you to provide, including the microSD card**, which the Pi needs before it will do anything at all.

> _Tip: you can often pilfer these out of an old Nintendo Switch, but it will wipe the card entirely. Otherwise, you can get one for about $20 with [Raspberry Pi OS already installed](https://www.pishop.us/product/class-10-microsd-card-with-raspberry-pi-os-bookworm-32gb/)_
>
> **Recommended specs:** A1, 32GB.

Depending on your project, you may also want:
- a case
- a micro-HDMI cable (the Pi 4 has micro-HDMI ports, not full-size)
- a keyboard and mouse (or [your laptop over ssh](https://www.raspberrypi.com/documentation/computers/remote-access.html)) 
- sensors
- wires
- a soldering kit
- and so on....

**If money is a barrier between you and the project you want to do,** email Acacia and say so. She is more than happy to work closely with you on it. If you want free rein to do whatever you like, though, the parts are yours to supply.

## what we ask

- Bring it back undamaged. 
- Write a short report (100 words or more) on what you ended up doing with it. "I didn't do anything with it because I got too busy" is fine. Due within 2 weeks of return.

## check one out

Fill out this form and hit **check out a pi**. Your email app will open the information below pre-filled. Make sure you actually send it; nothing gets saved or sent until you hit _Send_ in your email client.

_For Lawrence email, if your browser gives you a drop-down choice, use `outlook.cloud.microsoft`, not `outlook.office365.microsoft.`_

<form class="pi-form" id="pi-form" method="POST" action="{{ site.pi_library.endpoint }}" data-user="{{ site.pi_library.mail_user }}" data-domain="{{ site.pi_library.mail_domain }}">

  <p class="field">
    <label for="pi-name">Name</label>
    <input type="text" id="pi-name" name="name" autocomplete="name" required>
  </p>

  <p class="field">
    <label for="pi-luid">LUID</label>
    <input type="text" id="pi-luid" name="luid" inputmode="numeric" autocomplete="off" required>
  </p>

  <fieldset class="field" id="pi-when">
    <legend>When do you want it? <span class="hint">Pick one or more.</span></legend>
    <label><input type="checkbox" name="when" value="Fall term"> Fall term</label>
    <label><input type="checkbox" name="when" value="Winter break"> Winter break</label>
    <label><input type="checkbox" name="when" value="Winter term"> Winter term</label>
    <label><input type="checkbox" name="when" value="Spring term"> Spring term</label>
    <label><input type="checkbox" name="when" value="Other" id="pi-when-other"> Other</label>
    <input type="text" id="pi-when-other-text" name="when_other" placeholder="Which dates?" aria-label="Other dates" hidden>
  </fieldset>

  <p class="field">
    <label for="pi-plan">What do you plan to do with it? <span class="hint">As vague as you like.</span></label>
    <textarea id="pi-plan" name="plan" rows="4" required></textarea>
  </p>

  <fieldset class="field">
    <legend>Promises</legend>
    <label><input type="checkbox" name="promise_return" value="yes" required> I promise to bring it back undamaged.</label>
    <label><input type="checkbox" name="promise_report" value="yes" required> I promise to write a short report (100+ words) on what I ended up doing with it, even if the answer is "nothing."</label>
  </fieldset>

  <input type="text" name="_gotcha" class="pot" tabindex="-1" autocomplete="off" aria-hidden="true">

  <p class="field">
    <button type="submit" class="mono">check out a pi</button>
  </p>
  <p class="form-status mono" id="pi-status" aria-live="polite"></p>
</form>

<noscript><p class="mono">This form needs JavaScript. You can also just email acacia{dot}ackles{at}lawrence{dot}edu with the same information.</p></noscript>
