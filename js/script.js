'use strict';

// Scenarie data
const scenarios = {
  "1": {
    steps: [
      {
        content: `<h3>Mission 1: Email-fælden</h3>
                 <p>Du åbner din email og ser denne besked:</p>
                 <div class="email-preview">
                   <p><strong>Fra:</strong> Danske Bank &lt;kundeservice@danskebank-secure.net&gt;</p>
                   <p><strong>Emne:</strong> Vigtig: Din konto er blevet spærret</p>
                   <p>Kære kunde,</p>
                   <p>Vi har opdaget mistænkelig aktivitet på din konto. For at beskytte dine penge har vi midlertidigt spærret din konto. Klik på linket herunder for at verificere din identitet og genåbne din konto:</p>
                   <p><a href="#">https://danske-bank-secure.net/verify</a></p>
                 </div>`,
        options: [
          { text: "Klik på linket med det samme", correct: false, feedback: "Pas på! Dette er et klassisk phishing-forsøg. Banken vil aldrig bede dig klikke på et link i en email for at logge ind." },
          { text: "Ring til bankens officielle kundeservice", correct: true, feedback: "Godt tænkt! Ved at ringe til bankens officielle nummer kan du verificere om henvendelsen er ægte." },
          { text: "Ignorer emailen", correct: true, feedback: "Klogt valg! Hvis du er i tvivl, er det altid bedst at kontakte din bank direkte gennem deres officielle kanaler." }
        ]
      }
    ]
  },
  "2": {
    steps: [
      {
        content: `<h3>Mission 2: Sociale Medier</h3>
                 <p>Du får denne venneforespørgsel på Facebook:</p>
                 <div class="social-preview">
                   <img src="https://placeholder.com/150" alt="Profilbillede">
                   <p><strong>Maria Hansen</strong></p>
                   <p>Arbejder hos: Models Inc</p>
                   <p>Fælles venner: 0</p>
                   <p>Besked: "Hej! Jeg synes du ser sød ud. Skal vi være venner? 😊"</p>
                 </div>`,
        options: [
          { text: "Accepter anmodningen", correct: false, feedback: "Tænk dig om! At acceptere fremmede kan give dem adgang til dine private oplysninger." },
          { text: "Afvis og bloker profilen", correct: true, feedback: "Rigtig godt! Dette er sandsynligvis en falsk profil der forsøger at få adgang til dine personlige oplysninger." },
          { text: "Undersøg profilen nærmere først", correct: true, feedback: "Smart! Ved at undersøge profilen kan du ofte spotte tegn på at den er falsk." }
        ]
      }
    ]
  },
  "3": {
    steps: [
      {
        content: `<h3>Mission 3: Password Panik</h3>
                 <p>Du modtager denne email:</p>
                 <div class="breach-preview">
                   <p><strong>Fra:</strong> HaveIBeenPwned</p>
                   <p><strong>Emne:</strong> Dit password er blevet lækket</p>
                   <p>Dit password fra websitet "GameStore" er blevet fundet i en datalæk. Dette password blev også brugt på følgende sites:</p>
                   <ul>
                     <li>Email</li>
                     <li>Facebook</li>
                     <li>Netflix</li>
                   </ul>
                 </div>`,
        options: [
          { text: "Ignorer det, det er sikkert spam", correct: false, feedback: "Nej! Password-lækager er en reel trussel og bør tages alvorligt." },
          { text: "Skift til et nyt password på alle konti", correct: true, feedback: "Perfekt! Og husk at bruge forskellige passwords til forskellige tjenester." },
          { text: "Brug en password manager", correct: true, feedback: "Fremragende! En password manager kan hjælpe dig med at generere og huske unikke passwords til alle dine konti." }
        ]
      }
    ]
  }
};


document.addEventListener("DOMContentLoaded", () => {
  updateChoicesOverview();
  let currentScenario = null;
  let currentStep = 0;

  // Funktion til at vise sektion
  function showSection(sectionId) {
    // Skjul alle sektioner
    document.querySelectorAll('section').forEach(section => {
      section.classList.remove('active');
      if (section.id === 'hero') {
        section.style.display = 'none';
      }
    });
    
    const targetSection = document.querySelector(sectionId);
    if (targetSection) {
      targetSection.classList.add('active');
      targetSection.style.display = 'block';
    }

    // Vis altid choices sektionen når vi er på scenarios
    if (sectionId === '#scenarios') {
      document.getElementById('choices').style.display = 'block';
    }
  }

  // Popup funktioner
  function showPopup(popupId) {
    document.getElementById(popupId).style.display = 'block';
  }

  function hidePopup(popupId) {
    document.getElementById(popupId).style.display = 'none';
  }

  // Funktion til at vise scenarie indhold
  function showScenarioContent(scenario, step) {
    const content = scenarios[scenario].steps[step];
    const contentDiv = document.getElementById('scenarioContent');
    const optionsDiv = document.querySelector('.scenario-options');
    const feedbackDiv = document.querySelector('.scenario-feedback');
    
    // Vis indhold
    contentDiv.innerHTML = content.content;
    
    // Vis valgmuligheder
    optionsDiv.innerHTML = content.options.map((option, index) => `
      <button class="scenario-option" data-index="${index}">${option.text}</button>
    `).join('');
    
    // Tilføj event listeners til valgmuligheder
    document.querySelectorAll('.scenario-option').forEach(button => {
      button.addEventListener('click', handleOptionClick);
    });
    
    // Nulstil feedback
    feedbackDiv.style.display = 'none';
    feedbackDiv.innerHTML = '';
    
    // Vis popup
    showPopup('scenarioPopup');
  }

  // Håndter valg i scenarie
  function handleOptionClick(e) {
    const optionIndex = parseInt(e.target.dataset.index);
    const currentContent = scenarios[currentScenario].steps[currentStep];
    const selectedOption = currentContent.options[optionIndex];
  // Gem brugerens valg
    saveUserChoice(currentScenario, selectedOption.text);
  // Opdater oversigten over valg
    updateChoicesOverview();
    
    // Vis feedback
    const feedbackDiv = document.querySelector('.scenario-feedback');
    feedbackDiv.innerHTML = `
      <div class="feedback ${selectedOption.correct ? 'correct' : 'incorrect'}">
        <h4>${selectedOption.correct ? '✅ Godt valgt!' : '❌ Tænk dig om!'}</h4>
        <p>${selectedOption.feedback}</p>
      </div>
    `;
    feedbackDiv.style.display = 'block';
    
    // Deaktiver valgmuligheder
    document.querySelectorAll('.scenario-option').forEach(button => {
      button.disabled = true;
    });
    
    // Scroll til feedback
    feedbackDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Vis afslut-knap
    document.getElementById('scenarioCloseBtn').style.display = 'inline-block';
  }

  // Start scenarie
  function startScenario(scenarioNumber) {
    currentScenario = scenarioNumber;
    currentStep = 0;
    showScenarioContent(scenarioNumber, currentStep);
  }

  // Event listeners
  document.querySelector("#hero .btn").addEventListener("click", (e) => {
    e.preventDefault();
    showPopup('welcomePopup');
  });

  document.getElementById('nextButton').addEventListener('click', () => {
    hidePopup('welcomePopup');
    showSection('#info');
  });

  document.querySelector("#info .btn").addEventListener("click", (e) => {
    e.preventDefault();
    showSection('#scenarios');
  });

  document.querySelectorAll(".scenario-btn").forEach(button => {
    button.addEventListener("click", (e) => {
      const scenarioNumber = e.target.getAttribute("data-scenario");
      startScenario(scenarioNumber);
    });
  });

  document.getElementById('scenarioCloseBtn').addEventListener('click', () => {
    hidePopup('scenarioPopup');
    updateChoicesOverview(); 
    showSection('#scenarios');
  });
});

// Funktion til at gemme brugerens valg
function saveUserChoice(scenarioId, choiceText) {
  let savedChoices = JSON.parse(localStorage.getItem("userChoices")) || [];
  const existingIndex = savedChoices.findIndex(choice => choice.id === scenarioId);
  if (existingIndex > -1) {
    savedChoices[existingIndex].choice = choiceText;
  } else {
    savedChoices.push({ id: scenarioId, choice: choiceText });
  }
  localStorage.setItem("userChoices", JSON.stringify(savedChoices));
  console.log('Valg gemt:',{ scenarioId, choiceText});
  console.log('Alle gemte valg:', savedChoices);
}

// Funktion til at vise oversigt over brugerens valg
function updateChoicesOverview() {
  const choicesOverview = document.getElementById('choicesOverview');
  if (!choicesOverview) return;

  const savedChoices = JSON.parse(localStorage.getItem("userChoices")) || [];
  
  if (savedChoices.length === 0) {
    choicesOverview.innerHTML = '<p>Du har endnu ikke foretaget nogle valg.</p>';
    return;
  }

  const choicesList = savedChoices.map(choice => {
    const scenarioTitle = scenarios[choice.id].steps[0].content.match(/<h3>(.*?)<\/h3>/)[1];
    return `
      <div class="choice-item">
        <h4>${scenarioTitle}</h4>
        <p>Dit valg: ${choice.choice}</p>
      </div>
    `;
  }).join('');

  choicesOverview.innerHTML = `
    <h3>Dine valg</h3>
    ${choicesList}
  `;
}
