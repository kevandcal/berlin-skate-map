export const roundToOneDecimal = number => Math.round(number * 10) / 10;

export const handlePrecipitation = (hourlyData, setFunction) => {
  const hoursLeftToday = 24 - new Date().getHours();
  let chance = 0;
  for (let i = 0; i < hoursLeftToday; i++) {
    const { pop } = hourlyData[i];
    chance = pop >= chance ? pop : chance;
  }
  setFunction(chance * 100); // decimal -> percent
};

const addZero = number => `${number < 10 ? '0' : ''}${number}`;

export const calculateCountdown = (endTime, timeNow) => {
  const secondsLeft = Math.floor(endTime - timeNow);
  const hours = Math.floor(secondsLeft / (60 * 60));
  const minutes = Math.floor((secondsLeft - (hours * 60 * 60)) / 60);
  const seconds = Math.floor(secondsLeft - (hours * 60 * 60) - (minutes * 60));
  return `${addZero(hours)}:${addZero(minutes)}:${addZero(seconds)}`;
};