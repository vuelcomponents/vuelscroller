export const styles = () => {
  const style = document.createElement("style");
  style.textContent = `
        :root {
          --frequency-no-contribution-color: #e5e7ea;
          --frequency-tooltip-bg: #24292f;
          --frequency-tooltip-foreground: #ffffff;
          --frequency-ring-color: #00000010;
          --frequency-active:#c1f629;
          --frequency-more-active:#2f9f29;
          --frequency-high-active:#0f4f0b
        }
  `;
  document.head.appendChild(style);
};
