const drumPads = [
  { key: "Q", id: "Heater-1", url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3" },
  { key: "W", id: "Heater-2", url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3" },
  { key: "E", id: "Heater-3", url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3" },
  { key: "A", id: "Heater-4", url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3" },
  { key: "S", id: "Clap", url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3" },
  { key: "D", id: "Open-HH", url: "https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3" },
  { key: "Z", id: "Kick-n-Hat", url: "https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3" },
  { key: "X", id: "Kick", url: "https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3" },
  { key: "C", id: "Closed-HH", url: "https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3" },
];

function DrumPad({ keyTrigger, clipId, clipUrl, playSound, power }) {
  const [active, setActive] = React.useState(false);

  React.useEffect(() => {
    function handleKeyDown(e) {
      if (e.key.toUpperCase() === keyTrigger && power) {
        playSound(keyTrigger, clipId);
        setActive(true);
        setTimeout(() => setActive(false), 150);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [keyTrigger, clipId, playSound, power]);

  return (
    <div
      id={clipId}
      className={`drum-pad ${active ? "active" : ""}`}
      onClick={() => {
        if (!power) return;
        playSound(keyTrigger, clipId);
        setActive(true);
        setTimeout(() => setActive(false), 150);
      }}
    >
      {keyTrigger}
      <audio className="clip" id={keyTrigger} src={clipUrl}></audio>
    </div>
  );
}

function DrumMachine() {
  const [display, setDisplay] = React.useState("Power is OFF");
  const [power, setPower] = React.useState(false);
  const [volume, setVolume] = React.useState(0.5);

  function playSound(key, id) {
    const audio = document.getElementById(key);
    if (!audio) return;
    audio.currentTime = 0;
    audio.volume = volume;
    audio.play();
    setDisplay(id.replace(/-/g, " "));
  }

  function togglePower() {
    setPower(prev => {
      if (prev) setDisplay("Power is OFF");
      else setDisplay("Power is ON");
      return !prev;
    });
  }

  function handleVolumeChange(e) {
    setVolume(e.target.value);
    setDisplay("Volume: " + Math.round(e.target.value * 100));
    setTimeout(() => {
      setDisplay(power ? "Power is ON" : "Power is OFF");
    }, 1000);
  }

  return (
    <div id="drum-machine">
      <div id="display">{display}</div>
      <div className="pad-bank">
        {drumPads.map(pad => (
          <DrumPad
            key={pad.key}
            keyTrigger={pad.key}
            clipId={pad.id}
            clipUrl={pad.url}
            playSound={playSound}
            power={power}
          />
        ))}
      </div>
      <div className="controls">
        <div className="power-switch">
          <label htmlFor="power">Power</label>
          <input
            type="checkbox"
            id="power"
            checked={power}
            onChange={togglePower}
          />
        </div>
        <div>
          <label htmlFor="volume">Volume</label>
          <input
            id="volume"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            disabled={!power}
          />
        </div>
      </div>
    </div>
  );
}

ReactDOM.render(<DrumMachine />, document.getElementById("root"));
