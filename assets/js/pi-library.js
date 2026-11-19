// Raspberry Pi Lending Library form.
// If _config.yml sets pi_library.endpoint, the form POSTs there (a form service
// that emails the submission). If not, submitting opens the student's own email
// app with a message already written to pi_library.mail_user @ pi_library.mail_domain.

(function () {
  var form = document.getElementById("pi-form");
  if (!form) return;

  var status = document.getElementById("pi-status");
  var field = function (n) { return form.elements.namedItem(n); }; // form.name is the form's own name
  var whenBoxes = form.querySelectorAll('input[name="when"]');
  var other = document.getElementById("pi-when-other");
  var otherText = document.getElementById("pi-when-other-text");

  other.addEventListener("change", function () {
    otherText.hidden = !other.checked;
    otherText.required = other.checked;
    if (other.checked) otherText.focus();
  });

  // At least one "when" box must be checked. Browsers can't express that with
  // `required` on a checkbox group, so set a custom message on the first box.
  function checkWhen() {
    var any = Array.prototype.some.call(whenBoxes, function (b) { return b.checked; });
    whenBoxes[0].setCustomValidity(any ? "" : "Pick at least one.");
  }
  Array.prototype.forEach.call(whenBoxes, function (b) { b.addEventListener("change", checkWhen); });
  checkWhen();

  form.addEventListener("submit", function (e) {
    if (form.querySelector(".pot").value) { e.preventDefault(); return; }

    if (form.getAttribute("action")) {
      status.textContent = "Sending...";
      return; // let the browser POST to the form service
    }

    e.preventDefault();
    var when = Array.prototype.filter.call(whenBoxes, function (b) { return b.checked; })
      .map(function (b) { return b.value === "Other" ? "Other: " + otherText.value : b.value; });

    var body = [
      "Name: " + field("name").value,
      "LUID: " + field("luid").value,
      "When: " + when.join(", "),
      "",
      "What I plan to do with it:",
      field("plan").value,
      "",
      "I promise to bring it back undamaged.",
      "I promise to write a short report (100+ words) on what I ended up doing with it."
    ].join("\n");

    var subject = "Raspberry Pi checkout: " + field("name").value;
    // The address is split in the HTML to slow down scrapers.
    var to = form.dataset.user + "@" + form.dataset.domain;
    var url = "mailto:" + to +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);
    // New tab, so webmail (e.g. Outlook on the web) doesn't replace this page.
    var w = window.open(url, "_blank");
    if (!w) window.location.href = url; // blocked: fall back to this tab

    status.textContent = "Your email app should have opened with the request written out. Send it from there. If nothing opened, email the same information to " + to + ".";
  });
})();
