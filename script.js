const config = {
  creatorEmail: "davsir2025@gmail.com",
  paymentLink: "#"
};

let selectedSupport = {
  label: "No support option selected yet",
  amount: ""
};

const selectedBox = document.querySelector("#selectedBox");
const supportCards = document.querySelectorAll(".support-card");
const customAmount = document.querySelector("#customAmount");
const customButton = document.querySelector("#customButton");
const supportForm = document.querySelector("#supportForm");
const copyButton = document.querySelector("#copyMessage");
const selectedOptionInput = document.querySelector("#selectedOptionInput");
const subscribeModal = document.querySelector("#subscribeModal");
const subscribeOpenButtons = document.querySelectorAll("[data-open-subscribe]");
const subscribeCloseButtons = document.querySelectorAll("[data-close-subscribe]");
const subscriptionPlans = document.querySelectorAll(".plan-card");
const packetDetail = document.querySelector("#packetDetail");
const packetTitle = document.querySelector("#packetTitle");
const packetPrice = document.querySelector("#packetPrice");
const packetBenefits = document.querySelector("#packetBenefits");
const choosePacket = document.querySelector("#choosePacket");
const hidePacket = document.querySelector("#hidePacket");
const siteHeader = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const mainNav = document.querySelector("#mainNav");

const packetBenefitsByPlan = {
  Plus: [
    "Thank you shoutout on the website.",
    "Vote for the next Roblox video idea.",
    "Supporter status in the community."
  ],
  Premium: [
    "Everything in Plus.",
    "Personal thank you in a video.",
    "VIP role in Discord or the Roblox group.",
    "Early access to selected videos."
  ],
  Pro: [
    "Everything in Premium.",
    "Invite to private Roblox games or closed servers.",
    "Bigger vote power for the next video.",
    "Name added to a supporter banner on the site."
  ],
  Champion: [
    "Everything in Pro.",
    "Chance to play with DavXPro in a Roblox game.",
    "Chance to appear in a video.",
    "Special Champion supporter status."
  ],
  Legend: [
    "Everything in Champion.",
    "Top supporter spotlight on the website.",
    "Name mentioned in a video when possible.",
    "First invite chance for private games and video events.",
    "Special Legend status."
  ]
};

let activePlan = null;

function closeNavigation() {
  if (!siteHeader || !navToggle) {
    return;
  }

  siteHeader.classList.remove("nav-open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open navigation");
}

if (navToggle && siteHeader) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteHeader.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });
}

if (mainNav) {
  mainNav.addEventListener("click", (event) => {
    if (event.target.closest("a, button")) {
      closeNavigation();
    }
  });
}

if (supportForm) {
  supportForm.action = `https://formsubmit.co/${config.creatorEmail}`;
}

function updateSelected(label, amount) {
  selectedSupport = { label, amount };
  if (selectedBox) {
    selectedBox.innerHTML = `Selected: <strong>${label}${amount ? ` (${amount})` : ""}</strong>`;
  }

  if (selectedOptionInput) {
    selectedOptionInput.value = `${label}${amount ? ` (${amount})` : ""}`;
  }
}

supportCards.forEach((card) => {
  const button = card.querySelector(".select-support");

  button.addEventListener("click", () => {
    supportCards.forEach((item) => item.classList.remove("selected"));
    card.classList.add("selected");
    updateSelected(card.dataset.support, card.dataset.amount);
  });
});

if (customButton && customAmount) {
  customButton.addEventListener("click", () => {
    const amount = Number(customAmount.value);

    if (!amount || amount < 1) {
      customAmount.focus();
      return;
    }

    supportCards.forEach((item) => item.classList.remove("selected"));
    updateSelected("Custom support", `$${amount}`);
  });
}

function openSubscribeModal() {
  if (!subscribeModal) {
    return;
  }

  subscribeModal.classList.add("open");
  subscribeModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  subscriptionPlans[0]?.focus();
}

function closeSubscribeModal() {
  if (!subscribeModal) {
    return;
  }

  subscribeModal.classList.remove("open");
  subscribeModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  hidePacketDetail();
}

function hidePacketDetail() {
  if (packetDetail) {
    packetDetail.hidden = true;
  }

  activePlan = null;
  subscriptionPlans.forEach((item) => item.classList.remove("selected"));
}

function showPacketDetail(plan) {
  activePlan = plan;
  const planName = plan.dataset.plan;
  const monthly = plan.dataset.monthly;
  const weekly = plan.dataset.weekly;
  const benefits = packetBenefitsByPlan[planName] || [];

  if (packetTitle) {
    packetTitle.textContent = `${planName} packet`;
  }

  if (packetPrice) {
    packetPrice.textContent = `${monthly} or ${weekly}`;
  }

  if (packetBenefits) {
    packetBenefits.innerHTML = benefits.map((benefit) => `<li>${benefit}</li>`).join("");
  }

  if (packetDetail) {
    packetDetail.hidden = false;
  }

  if (choosePacket) {
    choosePacket.textContent = `Choose ${planName}`;
    choosePacket.focus();
  }
}

subscribeOpenButtons.forEach((button) => {
  button.addEventListener("click", openSubscribeModal);
});

subscribeCloseButtons.forEach((button) => {
  button.addEventListener("click", closeSubscribeModal);
});

subscriptionPlans.forEach((plan) => {
  plan.addEventListener("click", () => {
    subscriptionPlans.forEach((item) => item.classList.remove("selected"));
    plan.classList.add("selected");
    showPacketDetail(plan);
  });
});

if (hidePacket) {
  hidePacket.addEventListener("click", () => {
    hidePacketDetail();
    subscriptionPlans[0]?.focus();
  });
}

if (choosePacket) {
  choosePacket.addEventListener("click", () => {
    if (!activePlan) {
      return;
    }

    subscriptionPlans.forEach((item) => item.classList.remove("selected"));
    supportCards.forEach((item) => item.classList.remove("selected"));
    activePlan.classList.add("selected");
    updateSelected(
      `${activePlan.dataset.plan} subscription`,
      `${activePlan.dataset.monthly} or ${activePlan.dataset.weekly}`
    );
    document.querySelector("#supportType").value = "Subscription packet";
    closeSubscribeModal();
    window.setTimeout(() => {
      window.location.hash = "message";
      document.querySelector("#message").scrollIntoView();
    }, 50);
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && subscribeModal?.classList.contains("open")) {
    closeSubscribeModal();
  }
});

function buildMessage() {
  const name = document.querySelector("#supporterName").value.trim();
  const type = document.querySelector("#supportType").value;
  const message = document.querySelector("#supportMessage").value.trim();

  return [
    `Name: ${name}`,
    `Support type: ${type}`,
    `Selected option: ${selectedSupport.label}${selectedSupport.amount ? ` (${selectedSupport.amount})` : ""}`,
    "",
    message
  ].join("\n");
}

if (supportForm) {
  supportForm.addEventListener("submit", (event) => {
    if (!supportForm.reportValidity()) {
      event.preventDefault();
      return;
    }
  });
}

if (copyButton && supportForm) {
  copyButton.addEventListener("click", async () => {
    if (!supportForm.reportValidity()) {
      return;
    }

    await navigator.clipboard.writeText(buildMessage());
    copyButton.textContent = "Copied";

    window.setTimeout(() => {
      copyButton.textContent = "Copy message";
    }, 1600);
  });
}

const signupForm = document.querySelector("#signupForm");
const loginForm = document.querySelector("#loginForm");
const authResult = document.querySelector("#authResult");

function setAuthResult(message, type = "success") {
  if (!authResult) {
    return;
  }

  authResult.textContent = message;
  authResult.className = `auth-result ${type}`;
}

function getSavedAccount() {
  const savedAccount = window.localStorage.getItem("davXProAccount");
  return savedAccount ? JSON.parse(savedAccount) : null;
}

if (signupForm) {
  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(signupForm);
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    if (password !== confirmPassword) {
      setAuthResult("Passwords do not match.", "error");
      return;
    }

    const account = {
      name: formData.get("name"),
      dateOfBirth: formData.get("dateOfBirth"),
      email: formData.get("email"),
      password
    };

    window.localStorage.setItem("davXProAccount", JSON.stringify(account));
    setAuthResult("Account created. You can log in now.", "success");
    signupForm.reset();
  });
}

if (loginForm) {
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(loginForm);
    const savedAccount = getSavedAccount();
    const email = formData.get("email");
    const password = formData.get("password");

    if (!savedAccount) {
      setAuthResult("Create an account first on the sign up page.", "error");
      return;
    }

    if (savedAccount.email === email && savedAccount.password === password) {
      setAuthResult(`Welcome back, ${savedAccount.name}.`, "success");
      loginForm.reset();
      return;
    }

    setAuthResult("Email or password is incorrect.", "error");
  });
}
