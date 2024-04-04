// Function to handle form submission for login
var urlParams = new URLSearchParams(window.location.search);
var returnUrl = urlParams.get("returnUrl") || "/";

const registerForm = document.querySelector(".registerForm:not(.nonInfo");
const nonInfoRegisterForm = document.querySelector(".registerForm.nonInfo");

document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const username = document.getElementById("loginUsername").value;
  var password = document.getElementById("loginPassword").value;

  // Make a POST request to the login endpoint
  fetch("/api/account/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  })
    .then((response) => {
      if (response.status === 401) {
        userAlert("Identifiants incorrects");
      } else if (response.status === 402) {
        userAlert("Mot de passe incorrect");
      } else {
        window.location.href = returnUrl; // Redirect to the returned URL
      }
    })
    .then((data) => {
      if (data && data.error) {
        // Display error message to the user
        console.error(data.error);

        console.log("there was an error when logging in");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

async function sendChckCodeFetch() {
  const passcode = document.getElementById("passcode").value;
  const email = document.getElementById("emailOublie").value;

  const passcodeResponse = await fetch("/api/account/checkPasscode", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ passcode, email }),
  });

  if (passcodeResponse.status === 403) {
    userAlert("Mauvais code, merci de réessayer");
  } else window.location.reload();
}

if (registerForm.classList.contains("emailSubmit")) {
  registerForm.addEventListener("submit", async (e) => {
    // Note the async keyword here
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email");

    try {
      const response = await fetch("/api/account/verifyEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.status === 409) {
        userAlert("Adresse mail déjà utilisée");
      } else if (response.status === 403) {
        userAlert(
          "Si vous réésayez, votre compte sera bani et vous serez signalé au département"
        );
      } else if (response.status === 400) {
        userAlert("Email invalide");
      } else {
        // Pop up to say that the email has been sent and input for the passcode

        //add the passcode input and submit button
        const passcodeInput = document.createElement("input");
        passcodeInput.setAttribute("type", "text");
        passcodeInput.setAttribute("id", "passcode");
        passcodeInput.setAttribute("placeholder", "Code de vérification");
        passcodeInput.setAttribute("required", "true");
        document.getElementById("emailFormInputs").appendChild(passcodeInput);

        const checkEmailButton = document.getElementById("validateEmailButton");
        checkEmailButton.setAttribute("type", "button");
        checkEmailButton.setAttribute("onclick", "sendChckCodeFetch()");
        checkEmailButton.setAttribute("value", "Vérifier le code");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });
} else {
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    var password = document.getElementById("registerPassword").value;

    const category = document.getElementById("category").value;

    // Make a POST request to the register endpoint
    fetch("/api/account/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password, category }),
    })
      .then((response) => {
        if (response.status === 403) {
          userAlert(
            "Si vous réésayez, votre compte sera bani et vous serez signalé au département"
          );
        } else if (response.status === 409) {
          userAlert("Adresse mail déjà utilisée");
        } else if (response.status === 500) {
          userAlert(
            "Impossible de créer le compte, merci de réessayer plus tard"
          );
        } else if (response.status === 402) {
          userAlert("Pseudo déjà utilisé");
        } else {
          window.location.href = returnUrl; // Redirect to the returned URL
        }
      })
      .then((data) => {
        if (data && data.error) {
          // Display error message to the user
          console.error(data.error);

          console.log("there was an error when registering");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
}

nonInfoRegisterForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;

  fetch("/api/account/nonInfoRegister", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email }),
  }).then((response) => {
    if (response.status === 409) {
      userAlert("Nom déjà utilisé");
    } else if (response.status === 200) {
      window.location.href = returnUrl;
    }
  });
});
// Function to handle form submission for registration
