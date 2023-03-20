import { sustainabilityScorePOST } from './api';
import { numberToSustainabilityScore, SustainabilityScore } from './sustainabilityScore';
import { delay, filterClassList, isOnKayak } from './utils';

let sustainabilityScore: SustainabilityScore | undefined;

const destinationElementQuery = isOnKayak ? '.k_my-input' : '#destinationInput-input';
const maxTimeout = 10000;
const readingInterval = 100;

export async function readDestination(timeout: number = maxTimeout): Promise<HTMLInputElement | undefined> {
  const destination = document.querySelector<HTMLInputElement>(destinationElementQuery);

  if (destination) {
    return destination;
  } else if (timeout > 0) {
    await delay(readingInterval);

    return readDestination(timeout - readingInterval);
  } else return undefined;
}

const destinationContainerQuerySelector =
  window.location.host === 'www.kayak.com' ? '[class$="-destination"]' : '[class^="SearchControls_destination__"]';

let showEcoMioWindow = false;

export function setupEcoMioWidget(destination?: HTMLInputElement) {
  const destinationContainer = setupDestinationContainer();

  if (!destinationContainer || !destination) return;

  const ecoMioButton = setupEcoMioButton(destinationContainer);
  const ecoMioWindow = setupEcoMioWindow(destinationContainer);
  const sustainabilityScoreProgressBar = document.querySelector<HTMLElement>('.sustainabilityScoreProgressBar');
  const progressBarValueLabel = document.querySelector<HTMLElement>('.progressBarValueLabel');

  if (!sustainabilityScoreProgressBar || !progressBarValueLabel) return;

  const setupEventsParams: SetupEventsParams = {
    ecoMioButton,
    ecoMioWindow,
    destination,
    destinationContainer,
    sustainabilityScoreProgressBar,
    progressBarValueLabel,
  };

  setupEvents(setupEventsParams);
  sustainabilityScorePOST({
    origin: window.location.host,
    destination: destination.value,
    time_of_search: new Date().toISOString(),
  }).then((data) => {
    console.log({ data });

    progressBarValueLabel.innerText = data?.sustainability_score + '%';

    if (data?.sustainability_score) {
      sustainabilityScore = numberToSustainabilityScore(data.sustainability_score);
      updateHeighlightingWithSustainabilityScore({
        ecoMioWindow,
        destinationContainer,
        sustainabilityScoreProgressBar,
        progressBarValueLabel,
      });
    }
  });
}

type SetupEventsParams = {
  ecoMioButton: HTMLElement;
  ecoMioWindow: HTMLElement;
  destination: HTMLInputElement;
  destinationContainer: HTMLElement;
  progressBarValueLabel: HTMLElement;
  sustainabilityScoreProgressBar: HTMLElement;
};

let lastDestinationValue: string | undefined;

function setupEvents({
  ecoMioButton,
  ecoMioWindow,
  destination,
  destinationContainer,
  progressBarValueLabel,
  sustainabilityScoreProgressBar,
}: SetupEventsParams) {
  ecoMioButton.addEventListener('click', () => {
    showEcoMioWindow = !showEcoMioWindow;

    handleEcoMioButtonClick({
      ecoMioButton,
      ecoMioWindow,
      destination,
      destinationContainer,
      progressBarValueLabel,
      sustainabilityScoreProgressBar,
    });
  });

  if (isOnKayak) {
    setInterval(() => {
      const itemValue = destinationContainer.querySelector('[class$="-item-value"]');

      if (itemValue?.innerHTML !== lastDestinationValue) {
        lastDestinationValue = itemValue?.innerHTML;

        sustainabilityScorePOST({
          origin: window.location.host,
          destination: lastDestinationValue ?? 'Unknown',
          time_of_search: new Date().toISOString(),
        }).then((data) => {
          console.log({ data });

          progressBarValueLabel.innerText = data?.sustainability_score + '%';

          if (data?.sustainability_score) {
            sustainabilityScore = numberToSustainabilityScore(data.sustainability_score);
            updateHeighlightingWithSustainabilityScore({
              ecoMioWindow,
              destinationContainer,
              progressBarValueLabel,
              sustainabilityScoreProgressBar,
            });
          }
        });
      }
    }, 100);
  } else {
    setInterval(() => {
      if (destination.value !== lastDestinationValue) {
        lastDestinationValue = destination.value;

        sustainabilityScorePOST({
          origin: window.location.host,
          destination: lastDestinationValue,
          time_of_search: new Date().toISOString(),
        }).then((data) => {
          console.log({ data });

          progressBarValueLabel.innerText = data?.sustainability_score + '%';

          if (data?.sustainability_score) {
            sustainabilityScore = numberToSustainabilityScore(data.sustainability_score);
            updateHeighlightingWithSustainabilityScore({
              ecoMioWindow,
              destinationContainer,
              progressBarValueLabel,
              sustainabilityScoreProgressBar,
            });
          }
        });
      }
    }, 100);
  }
}

function setupDestinationContainer(): HTMLElement | null {
  const destinationContainer = document.querySelector<HTMLElement>(destinationContainerQuerySelector);

  destinationContainer?.classList.add('destinationBox');

  return destinationContainer;
}

function setupEcoMioButton(destinationContainer: HTMLElement): HTMLElement {
  const ecoMioButton = document.createElement('button');

  ecoMioButton.classList.add('ecoMioButton');
  destinationContainer?.appendChild(ecoMioButton);
  setupEcoMioButtonLogo(ecoMioButton);

  return ecoMioButton;
}

function handleEcoMioButtonClick(params: SetupEventsParams) {
  updateEcoMioButton(params.ecoMioButton);
  updateEcoMioWindow(params.ecoMioWindow);
}

function updateEcoMioWindow(ecoMioWindow: HTMLElement) {
  if (showEcoMioWindow) {
    ecoMioWindow.classList.remove('ecoMioWindowHidden');
  } else {
    ecoMioWindow.classList.add('ecoMioWindowHidden');
  }
}

function updateEcoMioButton(ecoMioButton: HTMLElement) {
  if (showEcoMioWindow) {
    ecoMioButton.classList.add('ecoMioButtonActivated');
  } else {
    ecoMioButton.classList.remove('ecoMioButtonActivated');
  }
}

function setupEcoMioButtonLogo(ecoMioButton: HTMLElement): HTMLElement {
  const ecoMioButtonLogo = document.createElement('img');

  ecoMioButtonLogo.src = 'https://ecomio.com/wp-content/uploads/eco.mio_RGB_white_small.png';

  ecoMioButtonLogo.classList.add('ecoMioButtonLogo');
  ecoMioButton.appendChild(ecoMioButtonLogo);

  return ecoMioButtonLogo;
}

function setupEcoMioWindow(destinationContainer: HTMLElement): HTMLElement {
  const ecoMioWindow = document.createElement('div');

  ecoMioWindow.classList.add('ecoMioWindow', 'ecoMioWindowHidden');
  destinationContainer.appendChild(ecoMioWindow);

  ecoMioWindow.innerHTML = `
    <hr></hr>
    <h3 class='sustainabilityScoreTitle'>Sustainability Score</h3>
    <div class='sustainabilityScoreProgressBarWrapper'>
      <div class='sustainabilityScoreProgressBar'></div>
      <span class='progressBarValueLabel'>50%</span>
    </div>
  `;

  return ecoMioWindow;
}

type UpdateHeighlightingWithSustainabilityScoreParams = {
  ecoMioWindow: HTMLElement;
  destinationContainer: HTMLElement;
  progressBarValueLabel: HTMLElement;
  sustainabilityScoreProgressBar: HTMLElement;
};

export function updateHeighlightingWithSustainabilityScore({
  ecoMioWindow,
  destinationContainer,
  sustainabilityScoreProgressBar,
  progressBarValueLabel,
}: UpdateHeighlightingWithSustainabilityScoreParams) {
  filterClassList((className) => className.startsWith('windowShadow'), ecoMioWindow);
  filterClassList((className) => className.startsWith('destinationShadow'), destinationContainer);
  filterClassList((className) => className !== 'sustainabilityScoreProgressBar', sustainabilityScoreProgressBar);

  sustainabilityScoreProgressBar.style.setProperty('--progress-value', progressBarValueLabel.innerText);

  switch (sustainabilityScore) {
    case 'good': {
      destinationContainer.classList.add('destinationShadowGoodScore');
      ecoMioWindow.classList.add('windowShadowGoodScore');
      sustainabilityScoreProgressBar.classList.add('sustainabilityScoreProgressBarGood');
      break;
    }
    case 'oneleaf': {
      destinationContainer.classList.add('destinationShadowOneLeafScore');
      ecoMioWindow.classList.add('windowShadowOneLeafScore');
      sustainabilityScoreProgressBar.classList.add('sustainabilityScoreProgressBarOneLeaf');
      break;
    }
    case 'noleaf': {
      destinationContainer.classList.add('destinationShadowNoLeafScore');
      ecoMioWindow.classList.add('windowShadowNoLeafScore');
      sustainabilityScoreProgressBar.classList.add('sustainabilityScoreProgressBarNoLeaf');
      break;
    }
    case 'bad': {
      destinationContainer.classList.add('destinationShadowBadScore');
      ecoMioWindow.classList.add('windowShadowBadScore');
      sustainabilityScoreProgressBar.classList.add('sustainabilityScoreProgressBarBad');
      break;
    }
  }
}
