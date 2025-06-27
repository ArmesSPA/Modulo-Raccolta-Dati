
//DATA
window.onload = () => {
    const oggi = new Date();
    const giorno = String(oggi.getDate()).padStart(2, '0');
    const mese = String(oggi.getMonth() + 1).padStart(2, '0');
    const anno = oggi.getFullYear();
    const dataLocale = `${giorno}/${mese}/${anno}`;
    document.getElementById("data").textContent = dataLocale;
};

let dataLocale = new Date().toLocaleDateString(); 

//API con INDIRIZZO

function cercaIndirizzo() {
  const via = document.getElementById("via")?.value.trim();
  const citta = document.getElementById("citta")?.value.trim();
  const paese = document.getElementById("paese")?.value.trim();

  if (!via || !citta || !paese) {
    alert("Inserisci indirizzo, città e paese.");
    return;
  }

  const query = encodeURIComponent(`${via}, ${citta}, ${paese}`);
  fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&addressdetails=1`)
    .then(res => res.json())
    .then(data => {
      if (data.length > 0) {
        const luogo = data[0];
        document.getElementById("cap").value = luogo.address.postcode || "Non trovato";
        document.getElementById("provincia").value = luogo.address.county || "Non trovata";
        document.getElementById("lat").value = luogo.lat;
        document.getElementById("lon").value = luogo.lon;
      } else {
        alert("Nessun risultato trovato.");
      }
    })
    .catch(error => {
      console.error("Errore nella fetch:", error);
      alert("Errore durante la richiesta.");
    });
}


// POSIZIONE SCAFFALATURA
let radiosPosizione = document.querySelectorAll('input[name="posizione-scaffalatura"]');
radiosPosizione.forEach(radio => {
    radio.addEventListener("click", function () {
        if (this.value === "Su Pavimento" && this.checked) {
            document.getElementById("hidden-pavimento").style.display = "block";
            document.getElementById("hidden-solaio").style.display = "none";
        } else if (this.value === "Su Solaio" && this.checked) {
            document.getElementById("hidden-solaio").style.display = "block";
            document.getElementById("hidden-pavimento").style.display = "none";
        }

        // Deseleziona se cliccato due volte
        if (this.dataset.checked === "true") {
            this.checked = false;
            document.getElementById("hidden-pavimento").style.display = "none";
            document.getElementById("hidden-solaio").style.display = "none";
        }
        this.dataset.checked = this.checked.toString();
    });
});

// VITA TEMPO
let radiosVita = document.querySelectorAll('input[name="vita-tempo"]');
radiosVita.forEach(radio => {
    radio.addEventListener("click", function () {
        if (this.value === "Altro" && this.checked) {
            document.getElementById("hidden-vitaImpianto").style.display = "block";
        } else {
            document.getElementById("hidden-vitaImpianto").style.display = "none";
        }

        if (this.dataset.checked === "true") {
            this.checked = false;
            document.getElementById("hidden-vitaImpianto").style.display = "none";
        }
        this.dataset.checked = this.checked.toString();
    });
});

// MAGAZZINO
let radiosMagazzino = document.querySelectorAll('input[name="magazzino"]');
radiosMagazzino.forEach(radio => {
    radio.addEventListener("click", function () {
        if (this.value === "magazzinoFreddo" && this.checked) {
            document.getElementById("hidden-temperatura").style.display = "block";
        } else {
            document.getElementById("hidden-temperatura").style.display = "none";
        }

        if (this.dataset.checked === "true") {
            this.checked = false;
            document.getElementById("hidden-temperatura").style.display = "none";
        }
        this.dataset.checked = this.checked.toString();
    });
});

// FINITURE SPECIALI
let radiosFinitura = document.querySelectorAll('input[name="finitura"]');
let selectColore = document.getElementById("colore-select");
let specialeDiv = document.getElementById("hidden-specialeColore");
let inputSpeciale = document.getElementById("colore-speciale");

function aggiornaSpecialeColore() {
    if (selectColore.value === "Colore Speciale a Scelta") {
        specialeDiv.style.display = "block";
    } else {
        specialeDiv.style.display = "none";
        inputSpeciale.value = "";
    }
}

// Listener fisso sul select (una volta sola)
selectColore.addEventListener("change", aggiornaSpecialeColore);

radiosFinitura.forEach(radio => {
    radio.addEventListener("click", function () {
        let sceltaColoreDiv = document.getElementById("hidden-sceltaColore");
        let zincaturaDiv = document.getElementById("hidden-zincatura");

        if (this.dataset.checked === "true") {
            this.checked = false;
            sceltaColoreDiv.style.display = "none";
            zincaturaDiv.style.display = "none";
            specialeDiv.style.display = "none";
            inputSpeciale.value = "";
        } else {
            if (this.value === "finituraColore") {
                sceltaColoreDiv.style.display = "block";
                zincaturaDiv.style.display = "none";
                aggiornaSpecialeColore(); // <-- fondamentale per il tuo problema
            } else if (this.value === "finituraZincatura") {
                zincaturaDiv.style.display = "block";
                sceltaColoreDiv.style.display = "none";
                specialeDiv.style.display = "none";
                inputSpeciale.value = "";
            }
        }

        // Aggiorna stato checked personalizzato
        radiosFinitura.forEach(r => r.dataset.checked = "false");
        this.dataset.checked = this.checked.toString();
    });
});

let allRadios = document.querySelectorAll('input[type="radio"]');

// Salva lo stato checked in dataset
let radioRelazione = document.getElementsByName("relazioneCalcolo")[0];
let radioCertificazione = document.getElementsByName("certificazioneMateriali")[0];
let radioProvini = document.getElementsByName("provini")[0];
let radioDichiarazione = document.getElementsByName("dichiarazioneConformita")[0];

function toggleRadio(radio) {
    radio.addEventListener("click", function () {
        if (this.dataset.checked === "true") {
            this.checked = false;
            this.dataset.checked = "false";
        } else {
            this.dataset.checked = "true";
        }
    });
}

toggleRadio(radioRelazione);
toggleRadio(radioCertificazione);
toggleRadio(radioProvini);
toggleRadio(radioDichiarazione);

let arrayAPR12 = [];

function aggiungiPreventivo(event) {
    event.preventDefault();

    let numeroPreventivo = document.getElementById("numeroPreventivo").value;
    let nomeCommerciante = document.getElementById("nomeCommerciante").value;
    let cliente = document.getElementById("cliente").value;
    let normativa = document.getElementById("normativa").value;
    let posizioneScaffalatura = document.querySelector('input[name="posizione-scaffalatura"]:checked')?.value || "";
    let via = document.getElementById("via").value;
    let citta = document.getElementById("citta").value;
    let paese = document.getElementById("paese").value;
    let cap = document.getElementById("cap").value;
    let provincia = document.getElementById("provincia").value;
    let lat = document.getElementById("lat").value;
    let lon = document.getElementById("lon").value;

    let nuovoPreventivo = ({
        numeroPreventivo : numeroPreventivo,
        nomeCommerciante : nomeCommerciante,
        cliente : cliente,
        data : dataLocale,
        normativa : normativa,
        via : via,
        citta : citta,
        paese : paese,
        cap : cap,
        provincia : provincia,
        lat : lat,
        lon : lon,
        posizioneScaffalatura : posizioneScaffalatura,
    });

    if (posizioneScaffalatura === "Su Pavimento") {
        let spessore = document.getElementById("spessore-pavimento").value;
        let qualitaCalcestruzzo = document.getElementById("qualitaCalcestruzzo-pavimento").value;

        nuovoPreventivo.spessore = document.getElementById("spessore-pavimento").value;
        nuovoPreventivo.qualitaCalcestruzzo = document.getElementById("qualitaCalcestruzzo-pavimento").value;     
    }
    else if (posizioneScaffalatura === "Su Solaio") {
        let spessore = document.getElementById("spessore-solaio").value;
        let qualitaCalcestruzzo = document.getElementById("qualitaCalcestruzzo-solaio").value;
        let altezzaEdificio = document.getElementById("altezzaEdificio").value;
        let quotaEstrodosso = document.getElementById("quotaEstrodosso").value;

        nuovoPreventivo.spessore = document.getElementById("spessore-solaio").value;
        nuovoPreventivo.qualitaCalcestruzzo = document.getElementById("qualitaCalcestruzzo-solaio").value;
        nuovoPreventivo.altezzaEdificio = document.getElementById("altezzaEdificio").value;
        nuovoPreventivo.quotaEstrodosso = document.getElementById("quotaEstrodosso").value;
    }

    let vitaNominale = document.querySelector('input[name="vita-tempo"]:checked');

    if(vitaNominale && vitaNominale.value === "35 anni") {
        let vitaImpianto = document.getElementById("35-anni").value;

        nuovoPreventivo.vitaImpianto = vitaImpianto;
    }
    else if(vitaNominale && vitaNominale.value === "50 anni") {
        let vitaImpianto = document.getElementById("50-anni").value;

        nuovoPreventivo.vitaImpianto = vitaImpianto;
    }
    else if(vitaNominale && vitaNominale.value === "Altro") {
        let vitaImpianto = document.getElementById("vitaImpianto").value;

        nuovoPreventivo.vitaImpianto = vitaImpianto;
    }

    let classeUso = document.getElementById("classeUso").value;
    let sottosuolo = document.getElementById("sottosuolo").value;
    let topografica = document.getElementById("topografica").value;
    let temperaturaMagazzino = document.querySelector('input[name="magazzino"]:checked');
    let condensaMagazzino = document.querySelector('input[name="condensa"]:checked');

    nuovoPreventivo.classeUso = classeUso;
    nuovoPreventivo.sottosuolo = sottosuolo;
    nuovoPreventivo.topografica = topografica;

    if(temperaturaMagazzino && temperaturaMagazzino.value === "magazzinoAmbiente") {
        nuovoPreventivo.temperaturaMagazzino = "Ambiente";
    } 
    else if (temperaturaMagazzino && temperaturaMagazzino.value === "magazzinoFreddo") {
        nuovoPreventivo.temperaturaMagazzino = "Freddo";
        nuovoPreventivo.temperaturaMagazzinoFreddo = document.getElementById("temperatura").value;
        nuovoPreventivo.condensaMagazzino = condensaMagazzino?.value || "";
    }

    let percentualeRiempimento = document.getElementById("percentualeRiempimento").value;
    let pesoMassimo = document.getElementById("pesoMassimo").value;
    let pesoMedio = document.getElementById("pesoMedio").value;
    let tipologiaPallet = document.getElementById("tipologia-pallet").value;
    let tipologiaMerce = document.getElementById("tipologia-merce").value;

    nuovoPreventivo.percentualeRiempimento = percentualeRiempimento;
    nuovoPreventivo.pesoMassimo = pesoMassimo;
    nuovoPreventivo.pesoMedio = pesoMedio;
    nuovoPreventivo.tipologiaPallet = tipologiaPallet;
    nuovoPreventivo.tipologiaMerce = tipologiaMerce;

    let finitura = document.querySelector('input[name="finitura"]:checked');

    if (finitura && finitura.value === "finituraColore") {
        let colore = document.getElementById("colore-select").value;

        if (colore === "Colore Speciale a Scelta") {
            colore = document.getElementById("colore-speciale").value;
        }

        nuovoPreventivo.finitura = "Colore"
        nuovoPreventivo.colore = colore;
    }
    else if (finitura && finitura.value === "finituraZincatura") {
        let zincatura = document.querySelector('input[name="zincatura"]:checked')?.value || "";

        nuovoPreventivo.finitura = "Zincatura"
        nuovoPreventivo.zincatura = zincatura;
    }

    if(document.getElementById("relazioneCalcolo").checked) {
        let relazioneCalcolo = document.getElementById("relazioneCalcolo").value;

        nuovoPreventivo.relazioneCalcolo = relazioneCalcolo;
    }

    if(document.getElementById("certificazioneMateriali").checked) {
        let certificazioneMateriali = document.getElementById("certificazioneMateriali").value;

        nuovoPreventivo.certificazioneMateriali = certificazioneMateriali;
    }

    if(document.getElementById("provini").checked) {
        let  provini = document.getElementById("provini").value;

        nuovoPreventivo.provini = provini;
    }

    if(document.getElementById("dichiarazioneConformita").checked) {
        let dichiarazioneConformita = document.getElementById("dichiarazioneConformita").value;

        nuovoPreventivo.dichiarazioneConformita = dichiarazioneConformita;
    }

    arrayAPR12.push(nuovoPreventivo);
    console.log(arrayAPR12);
    alert("Modulo Registrato");
    document.getElementById("form").reset();
    document.getElementById("hidden-pavimento").style.display = "none";
    document.getElementById("hidden-solaio").style.display = "none";
    document.getElementById("hidden-vitaImpianto").style.display = "none";
    document.getElementById("hidden-temperatura").style.display = "none";
    document.getElementById("hidden-sceltaColore").style.display = "none";
    document.getElementById("hidden-specialeColore").style.display = "none";
    document.getElementById("hidden-zincatura").style.display = "none";

    // Costruisci il tuo oggetto dati come prima...
    const ultimoPreventivo = { /* … tutti i campi … */ };

    console.log("Dati da inviare:", JSON.stringify(ultimoPreventivo));

    fetch('https://script.google.com/macros/s/AKfycbxrVxuiSRrsevbSXW9xx-tfiNuLUyqBc7tX3KzZ1ZJRrgtauUZ3zkSYMJGzFfQMk5C0/exec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors',
        body: JSON.stringify(ultimoPreventivo)
    })
        .then(res => res.json())
        .then(resp => {
            console.log("Risposta GAS:", resp);
            alert(resp.status === 'successo' ? "Dati salvati!" : "Errore: " + resp.error);
        })
        .catch(err => {
            console.error("Fetch diretto al GAS fallito:", err);
            alert("Errore di rete: " + err);
        });

}
//Da qui in poi c'è il collegamento al google sheet (va fatto per tutti i siti)
/*
const form = document.getElementById("form");

form.addEventListener("submit", function (event) {
  event.preventDefault();
    
  


});
*/