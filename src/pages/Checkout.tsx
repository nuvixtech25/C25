
// In the component where you create the countdown time
const createCountdownTime = () => {
  const time = new Date();
  time.setMinutes(time.getMinutes() + 15);
  return time;
};

// When passing endTime to CountdownBanner
<CountdownBanner 
  message={customization.topMessage}
  endTime={createCountdownTime()}
/>
