document.addEventListener('DOMContentLoaded', () => {
  const snowflakeCount = 50; // Number of snowflakes
  const body = document.body;

  function createSnowflake() {
    const snowflake = document.createElement('div');
    snowflake.classList.add('snowflake');
    snowflake.innerHTML = '❄'; // Snowflake character

    // Random positioning and animation properties
    const startLeft = Math.random() * window.innerWidth;
    const animationDuration = Math.random() * 3 + 4; // 4-7 seconds
    const animationDelay = Math.random() * 5; // 0-5 seconds delay
    const size = Math.random() * 10 + 10; // 10-20px size

    snowflake.style.left = `${startLeft}px`;
    snowflake.style.animationDuration = `${animationDuration}s`;
    snowflake.style.animationDelay = `${animationDelay}s`;
    snowflake.style.fontSize = `${size}px`;

    body.appendChild(snowflake);

    // Remove and recreate after animation to prevent buildup if logic changes,
    // but with infinite iteration it loops. However, to randomized positions on loop:
    snowflake.addEventListener('animationiteration', () => {
      snowflake.style.left = `${Math.random() * window.innerWidth}px`;
    });
  }

  for (let i = 0; i < snowflakeCount; i++) {
    createSnowflake();
  }
});
