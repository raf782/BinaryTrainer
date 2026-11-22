const typeSelect = document.getElementById("choix-type-adresse");
const address = document.getElementById("address");
const answer = document.getElementById("answer");
const result = document.getElementById("result");
const checkForm = document.getElementById("answer-form");
const newAddressButton = document.getElementById("new-address");

let expectedBinary = "";

function genererAdresseMac() {
  const octets = crypto.getRandomValues(new Uint8Array(6));
  octets[0] = (octets[0] & 0xfe) | 0x02;
  return Array.from(octets);
}

function genererIpv4Adresse() {
  return Array.from(crypto.getRandomValues(new Uint8Array(4)));
}

function genererIpv6Adresse() {
  return Array.from(crypto.getRandomValues(new Uint16Array(8)));
}

function afficherNouvelleAdresse() {
  const type = typeSelect.value;
  let groupes;
  let largeur;
  let séparateur;
  let adresseAffichee;

  if (type === "mac") {
    groupes = genererAdresseMac();
    largeur = 8;
    séparateur = ":";
    adresseAffichee = groupes
      .map((octet) => octet.toString(16).padStart(2, "0"))
      .join(séparateur);
  } else if (type === "ipv4") {
    groupes = genererIpv4Adresse();
    largeur = 8;
    séparateur = ".";
    adresseAffichee = groupes.join(séparateur);
  } else if (type === "ipv6") {
    groupes = genererIpv6Adresse();
    largeur = 16;
    séparateur = ":";
    adresseAffichee = groupes
      .map((groupe) => groupe.toString(16).padStart(4, "0"))
      .join(séparateur);
  } else {
    expectedBinary = "";
    address.textContent = "";
    answer.disabled = true;
    newAddressButton.disabled = true;
    checkForm.querySelector("button[type='submit']").disabled = true;
    result.textContent = "Choisissez un type d’adresse pour commencer.";
    result.className = "result";
    return;
  }

  expectedBinary = groupes
    .map((groupe) => groupe.toString(2).padStart(largeur, "0"))
    .join("");
  address.textContent = adresseAffichee;
  answer.value = "";
  answer.disabled = false;
  newAddressButton.disabled = false;
  checkForm.querySelector("button[type='submit']").disabled = false;
  result.textContent = `Convertissez chaque groupe en binaire sur ${largeur} bits.`;
  result.className = "result";
}

function verifierReponse() {
  const saisie = answer.value.trim();

  if (!expectedBinary) {
    result.textContent = "Choisissez d’abord un type d’adresse.";
    result.className = "result error";
    return;
  }

  if (!saisie) {
    result.textContent = "Saisissez votre réponse en binaire.";
    result.className = "result error";
    answer.focus();
    return;
  }

  if (!/^[01\s:.-]+$/.test(saisie)) {
    result.textContent = "La réponse doit contenir uniquement des 0 et des 1.";
    result.className = "result error";
    return;
  }

  const réponseBinaire = saisie.replace(/[\s:.-]/g, "");
  if (réponseBinaire === expectedBinary) {
    result.textContent = "Correct ! Vous pouvez générer une nouvelle adresse.";
    result.className = "result success";
  } else {
    result.textContent =
      `Ce n’est pas encore ça. Vérifiez le nombre de bits et la valeur de chaque groupe (${expectedBinary.length} bits au total).`;
    result.className = "result error";
  }
}

typeSelect.addEventListener("change", afficherNouvelleAdresse);
newAddressButton.addEventListener("click", afficherNouvelleAdresse);
checkForm.addEventListener("submit", (event) => {
  event.preventDefault();
  verifierReponse();
});

afficherNouvelleAdresse();
