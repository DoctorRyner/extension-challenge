import { readDestination, setupEcoMioWidget } from './ecoMioWidget';

console.log(
  '****************************************\n\neco.mio - Main content script running\n\n****************************************',
);

window.onload = async () => {
  setTimeout(async () => {
    const destination = await readDestination();

    if (destination) {
      setupEcoMioWidget(destination);
    } else {
      console.log(destination);
    }
  }, 1000);
};
