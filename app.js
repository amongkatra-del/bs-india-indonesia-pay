function showScreen(id, button) {
  document.querySelectorAll(".screen").forEach(function (screen) {
    screen.classList.remove("active");
  });

  const screen = document.getElementById(id);

  if (screen) {
    screen.classList.add("active");
  }

  document.querySelectorAll(".nav-btn").forEach(function (btn) {
    btn.classList.remove("active");
  });

  if (button) {
    button.classList.add("active");
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


function reviewTransfer() {
  const amount = document.getElementById("amount").value;
  const recipient = document.getElementById("recipient").value;
  const account = document.getElementById("account").value;

  if (!amount || Number(amount) <= 0) {
    alert("Please enter a valid amount.");
    return;
  }

  if (!recipient.trim()) {
    alert("Please enter recipient name.");
    return;
  }

  if (!account.trim()) {
    alert("Please enter recipient account or wallet.");
    return;
  }

  alert(
    "Transfer Review\n\n" +
    "Recipient: " + recipient +
    "\nAmount: " + amount +
    "\nAccount: " + account +
    "\n\nDemo mode: No real money will be transferred."
  );
}


function createRequest() {
  alert(
    "Payment request created.\n\n" +
    "This is currently demo/test mode."
  );
}


async function scanQR() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert(
      "Camera scanning is not supported by this browser."
    );
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: {
          ideal: "environment"
        }
      }
    });

    stream.getTracks().forEach(function (track) {
      track.stop();
    });

    alert(
      "Camera permission is working.\n\n" +
      "The QR payment scanner will be connected in the next step."
    );

  } catch (error) {
    alert(
      "Camera permission was not granted.\n\n" +
      "Please allow camera access and try again."
    );
  }
}


function goHome() {
  showScreen("home");

  document.querySelectorAll(".nav-btn").forEach(function (btn) {
    btn.classList.remove("active");
  });

  const homeButton = document.querySelector(
    '.nav-btn[onclick*="home"]'
  );

  if (homeButton) {
    homeButton.classList.add("active");
  }
}


document.addEventListener("DOMContentLoaded", function () {

  console.log("BS India Indonesia Pay loaded successfully.");

  const buttons = document.querySelectorAll("button");

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      console.log("Button clicked:", button.innerText);
    });
  });

});
