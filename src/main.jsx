input {
  font: inherit;
}

button {
  cursor: pointer;
  touch-action: manipulation;
}

.stage {
  min-height: 100vh;
  padding: max(20px, env(safe-area-inset-top)) max(20px, env(safe-area-inset-right)) max(20px, env(safe-area-inset-bottom)) max(20px, env(safe-area-inset-left));
  position: relative;
  overflow-x: hidden;
  transition: background 0.3s ease, color 0.3s ease;
}

.stage.night {
  color: #f3efff;
  background:
    radial-gradient(circle at 82% 18%, rgba(91, 122, 232, 0.48), transparent 22%),
    radial-gradient(circle at 76% 74%, rgba(54, 113, 211, 0.45), transparent 28%),
    linear-gradient(150deg, #2f226d 0%, #3a2a86 36%, #1e4f9a 100%);
}

.stage.night::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0.72;
  background-image:
    radial-gradient(circle, rgba(255, 247, 190, 0.86) 0 1.4px, transparent 2px),
    radial-gradient(circle, rgba(217, 228, 255, 0.72) 0 1px, transparent 1.8px),
    linear-gradient(120deg, rgba(255, 255, 255, 0.12) 0 1px, transparent 1px 18px);
  background-position: 22px 34px, 74px 92px, 0 0;
  background-size: 128px 118px, 176px 154px, 44px 44px;
  animation: skyDrift 36s linear infinite, skyPulse 7s ease-in-out infinite alternate;
}

.app {
  position: relative;
  z-index: 1;
}

.app {
  width: min(100%, 1040px);
  margin: 0 auto;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brandIcon,
.iconButton {
  width: 50px;
  height: 50px;
  border: 0;
  border-radius: 18px;
  display: grid;
  place-items: center;
  background: linear-gradient(145deg, var(--blue), rgba(255, 255, 255, 0.72));
  color: #5f7481;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.85);
  transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
}

.iconButton {
  background: rgba(255, 255, 255, 0.62);
  color: #8a7363;
}

.night .brandIcon {
  background: linear-gradient(145deg, #5c68da, #948bf0);
  color: #fff7c8;
}

.night .iconButton {
  background: rgba(255, 255, 255, 0.16);
  color: #fff6b9;
}

.iconButton:active,
.preset:active,
.reset:active,
.timer:active,
.toggle:active,
.play:active,
.saveMix:active {
  transform: scale(0.98);
}

h1,
h2,
h3,
h4,
p {
  margin: 0;
}

h1 {
  font-size: 1.55rem;
  letter-spacing: 0;
  color: #654f43;
}

.night h1 {
  color: #fff8d7;
}

.brand p {
  font-size: 0.9rem;
  color: var(--muted);
  margin-top: 2px;
}

.night .brand p,
.night .heading span,
.night .track p,
.night .hero p,
.night .note,
.night .saveMessage {
  color: #d7d2ff;
}

.hero {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 18px;
  padding: 22px;
  border-radius: 32px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(250, 236, 225, 0.7));
  border: 1px solid rgba(255, 255, 255, 0.86);
  box-shadow: 0 16px 44px rgba(103, 70, 53, 0.1);
}

.night .hero {
  background:
    radial-gradient(circle at 82% 18%, rgba(255, 242, 170, 0.18), transparent 24%),
    linear-gradient(150deg, rgba(66, 49, 154, 0.84), rgba(28, 76, 153, 0.62));
  border-color: rgba(255, 238, 180, 0.42);
  box-shadow: 0 24px 64px rgba(7, 8, 42, 0.32), inset 0 0 46px rgba(126, 151, 255, 0.18);
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #8a7363;
  font-size: 0.9rem;
}

.night .eyebrow {
  color: #fff6b9;
}

.hero h2 {
  margin-top: 12px;
  max-width: 360px;
  font-size: 2.6rem;
  line-height: 0.95;
  letter-spacing: 0;
}

.hero p {
  margin-top: 12px;
  max-width: 370px;
  color: var(--muted);
  font-size: 1rem;
  line-height: 1.5;
}

.window {
  position: relative;
  min-height: 220px;
  overflow: hidden;
  border-radius: 30px;
  background:
    radial-gradient(circle at 78% 30%, rgba(255, 237, 191, 0.8), transparent 18%),
    linear-gradient(150deg, rgba(203, 226, 236, 0.94), rgba(229, 217, 243, 0.78));
  border: 1px solid rgba(255, 255, 255, 0.82);
  isolation: isolate;
}

.window::before,
.window::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
}

.window::before {
  opacity: 0.58;
  background-image:
    radial-gradient(circle, rgba(255, 244, 190, 0.9) 0 1.7px, transparent 2.8px),
    radial-gradient(circle, rgba(255, 255, 255, 0.72) 0 1px, transparent 2px),
    radial-gradient(circle, rgba(198, 231, 238, 0.52) 0 1.2px, transparent 2.4px);
  background-position: 20px 34px, 78px 18px, 118px 86px;
  background-size: 86px 74px, 130px 96px, 108px 82px;
  animation: daylightGlints 22s linear infinite;
}

.window::after {
  opacity: 0.48;
  background:
    radial-gradient(circle at 18% 28%, rgba(255, 242, 184, 0.86) 0 2.2px, transparent 4px),
    radial-gradient(circle at 44% 16%, rgba(255, 255, 255, 0.78) 0 1.6px, transparent 3px),
    radial-gradient(circle at 74% 42%, rgba(255, 232, 203, 0.7) 0 2px, transparent 3.6px),
    radial-gradient(circle at 62% 76%, rgba(194, 228, 236, 0.5) 0 1.5px, transparent 3px);
  animation: daylightTwinkle 4.4s ease-in-out infinite alternate;
}

.night .window {
  background:
    radial-gradient(circle at 68% 20%, rgba(255, 246, 186, 0.9), transparent 12%),
    radial-gradient(circle at 78% 78%, rgba(43, 125, 214, 0.65), transparent 27%),
    linear-gradient(150deg, rgba(65, 50, 160, 0.96), rgba(31, 83, 168, 0.86));
  border-color: rgba(255, 238, 180, 0.48);
}

.night .window::before,
.night .window::after {
  opacity: 0.9;
}

.night .window::before {
  background-image:
    radial-gradient(circle, rgba(255, 249, 210, 1) 0 1.8px, transparent 2.8px),
    radial-gradient(circle, rgba(225, 233, 255, 0.86) 0 1.3px, transparent 2.4px),
    radial-gradient(circle, rgba(255, 255, 255, 0.74) 0 0.8px, transparent 1.7px);
  background-position: 18px 26px, 86px 54px, 44px 92px;
  background-size: 82px 66px, 122px 88px, 58px 52px;
  animation: starDrift 18s linear infinite;
}

.night .window::after {
