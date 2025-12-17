import React from "react";
import { motion } from "motion/react";
import { cn } from "../../lib/utils";

interface PreviewProps {
  power: boolean;
  themeMode: "dark" | "light";
  color: string; // OKLCH string or Hex
  maskSize: number; // 0 to 1
  glowScale: number; // 0.5 to 2
  positionX: number; // Left position in px
  positionY: number; // Top position in px
  noiseEnabled: boolean;
  noiseIntensity: number; // 0 to 1
  setPower: (v: boolean) => void;
  setHexColor: (v: string) => void;
}

export function Preview({
  power,
  themeMode,
  color,
  maskSize,
  glowScale,
  positionX,
  positionY,
  noiseEnabled,
  noiseIntensity,
  setPower,
  setHexColor,
}: PreviewProps) {
  // Transition settings
  const transition = {
    type: "tween",
    ease: [0.4, 0, 0.2, 1], // Bezier curve
    duration: 0.8,
  };

  const isDark = themeMode === "dark";

  // SVG noise as data URL
  const noiseSvg =
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' /></filter><rect width='100%' height='100%' filter='url(%23n)' /></svg>";

  // Random color generator and animation handler
  const handleSpotlightClick = () => {
    // Turn off glow
    setPower(false);

    // Wait for fade out to complete, then change color and turn back on
    setTimeout(() => {
      // Generate random hex color
      const randomHex =
        "#" +
        Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, "0");
      setHexColor(randomHex);

      // Turn glow back on after color change
      setTimeout(() => {
        setPower(true);
      }, 90);
    }, 950);
  };

  return (
    <div className="flex items-center justify-center p-10 min-h-[900px]">
      {/* Random Arrow Hint - Hidden on mobile */}
      <div className="absolute top-[405px] left-[30%] hidden lg:block pointer-events-none">
        <svg
          width="117"
          height="71"
          viewBox="0 0 117 71"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g opacity="0.3">
            <path
              d="M26.117 20.6755C25.8578 20.1878 26.0431 19.5824 26.5308 19.3232C27.0184 19.064 27.6239 19.2493 27.8831 19.737L27 20.2063L26.117 20.6755ZM116.299 52.4359C116.765 52.7327 116.902 53.3508 116.605 53.8166L111.77 61.4071C111.473 61.8729 110.855 62.0099 110.389 61.7132C109.923 61.4164 109.786 60.7983 110.083 60.3325L114.381 53.5854L107.634 49.2869C107.168 48.9902 107.031 48.372 107.328 47.9063C107.625 47.4405 108.243 47.3034 108.709 47.6002L116.299 52.4359ZM27 20.2063L27.8831 19.737C37.8859 38.5591 50.3653 48.7331 64.9743 53.2123C79.6331 57.7068 96.5683 56.51 115.545 52.303L115.762 53.2793L115.978 54.2556C96.8799 58.4895 79.5389 59.7698 64.388 55.1244C49.1872 50.4638 36.3235 39.8808 26.117 20.6755L27 20.2063Z"
              fill="#A19F9B"
              style={{ fill: "#A19F9B", fillOpacity: 1 }}
            />
            <path
              d="M10.096 11.864C10.048 12.008 9.856 12.072 9.728 12.12C9.584 12.184 9.488 12.344 9.312 12.36C9.152 12.376 8.992 12.376 8.832 12.36C7.824 12.296 6.928 11.768 6 11.4C4.928 11.16 3.936 10.664 2.944 10.216L2.816 10.312L2.768 10.472C2.736 11.192 2.752 11.896 2.624 12.6C2.608 12.76 2.576 12.904 2.544 13.064C2.464 13.144 2.352 13.144 2.256 13.144C2.176 13.16 2.112 13.096 2.032 13.064C1.456 12.28 1.504 11.272 1.584 10.344C1.776 8.408 1.504 6.472 1.648 4.52L1.68 4.392C1.28 4.152 1.152 3.672 1.04 3.256C1.056 3.224 1.056 3.208 1.072 3.176V3.032C1.104 3 1.12 2.952 1.152 2.92C1.936 2.6 2.8 2.504 3.632 2.568C5.104 2.68 6.56 3.224 7.664 4.216C8.272 4.776 8.88 5.496 8.864 6.376C8.784 7.112 8.016 7.448 7.392 7.64C6.032 8.136 4.56 8.056 3.2 8.568L3.088 8.632C4.368 9.416 5.856 9.736 7.2 10.392C8.064 10.952 9.056 11.288 10 11.704L10.016 11.72L10.096 11.864ZM7.616 5.88C7.536 5.736 7.44 5.592 7.36 5.448C6.368 4.744 5.248 4.104 4 4.008C3.6 3.976 3.2 3.992 2.816 4.088C2.752 4.312 2.688 4.536 2.704 4.776C2.688 5 2.672 5.224 2.64 5.448L2.656 5.48L2.608 5.64C2.624 6.12 2.496 6.664 2.72 7.112C3.808 6.904 4.88 6.712 5.968 6.504C6.528 6.344 7.216 6.392 7.616 5.88ZM18.3418 13.672C18.1658 13.992 18.2138 14.552 17.7658 14.632C17.0458 14.424 16.5818 12.024 16.2138 10.888L16.0858 11.032C15.3338 11.736 14.5338 12.728 13.3978 12.728L13.0938 12.696C12.0858 12.248 11.6538 11.096 11.6538 10.056V9.944C11.8618 8.328 12.4858 6.952 13.8938 6.056C14.1658 5.896 14.4538 5.784 14.7578 5.784H14.8218C15.5098 5.832 16.1818 6.104 16.7738 6.456C16.8858 6.488 16.9818 6.504 17.0938 6.504L17.1738 6.488C17.4138 6.488 17.5098 6.776 17.5098 7L17.3498 7.352C17.3178 7.8 17.2858 8.264 17.2858 8.728C17.2858 9.912 17.6218 11.144 17.8138 12.328C17.8938 12.808 18.3098 13.176 18.3418 13.672ZM15.9738 8.136C16.0058 7.928 16.0218 7.704 16.0218 7.496C16.0218 7.336 16.0218 7.192 15.9738 7.048C15.6218 6.888 15.2378 6.76 14.8378 6.728C13.5738 6.952 12.7898 8.872 12.7898 10.056C12.7898 10.424 12.8538 10.808 12.9978 11.144C13.0938 11.208 13.2218 11.224 13.3338 11.256L13.5898 11.224C14.7578 10.728 15.8778 9.368 15.9738 8.136ZM26.8564 13C26.7604 13.192 26.5844 13.288 26.3764 13.304H26.3444C26.2644 13.304 26.1844 13.272 26.1204 13.24C24.5044 11.784 24.2164 9.448 23.7684 7.432C23.7364 7.304 23.6564 7.192 23.5444 7.128H23.5124C22.8244 7.592 22.5204 8.424 22.2164 9.176C21.7684 10.264 21.1124 11.336 20.8404 12.504C20.7444 12.6 20.6644 12.68 20.5204 12.68C19.7364 12.68 19.6404 11.56 19.6404 10.824C19.6404 10.568 19.6564 10.376 19.6564 10.264V9.592C19.6564 9.352 19.6564 9.128 19.6244 8.888V8.728C19.6244 8.024 19.6564 5.8 20.5684 5.704H20.6004C20.9364 5.704 21.2244 5.976 21.2244 6.296C21.2244 6.68 20.9684 7.112 20.9044 7.496V7.64C20.9044 7.896 20.8724 8.136 20.8724 8.392C20.8724 8.504 20.8724 8.632 20.9044 8.744C21.2564 8.296 21.3844 7.736 21.6884 7.256C22.1684 6.584 22.5844 5.592 23.5124 5.48C24.8404 5.496 25.1284 6.936 25.3684 7.96V8.12C25.3684 9.16 25.8164 10.12 26.1044 11.112C26.1204 11.432 26.4564 11.64 26.5204 11.944C26.6964 12.264 26.8564 12.584 26.8564 12.952V13ZM33.6351 10.568C33.4431 12.488 32.4831 12.6 31.1231 12.6H30.9631C30.2271 12.568 29.4911 12.44 28.8031 12.168C28.3231 11.976 28.1471 11.464 27.8111 11.128C27.6031 10.712 27.5391 10.232 27.5391 9.768V9.592C27.5871 8.984 27.7951 8.344 28.2591 7.912C29.3951 6.968 30.5951 6.36 32.0991 6.104L32.1791 5.976C32.0671 4.824 31.9551 3.656 31.9551 2.504C31.9551 2.088 31.9711 1.672 32.0031 1.256V1.176C32.0191 0.983999 32.1311 0.759999 32.3391 0.712H32.4031C32.7391 0.855999 33.2191 0.615999 33.2191 1.4C33.0271 1.832 33.0271 2.536 33.0271 3.08C33.1711 4.072 32.9951 5.224 33.3631 6.072C33.5711 6.28 33.6511 6.568 33.6671 6.856L33.6511 6.952C33.5391 7.176 33.5231 7.56 33.5231 7.768L33.6671 9.048L33.6511 9.24L33.6831 9.832L33.6511 10.056L33.6671 10.408L33.6351 10.568ZM32.6271 10.6C32.6431 10.44 32.6591 10.28 32.6591 10.12C32.6591 9.384 32.5631 8.2 32.3391 7.656C31.2351 7.672 30.2591 8.28 29.3791 8.888C29.1711 9.208 28.7711 9.416 28.7071 9.832C28.7071 9.96 28.7551 10.056 28.8191 10.168C29.1711 11.144 30.3871 10.872 31.1711 11.128H31.3311C31.4271 11.144 31.5391 11.144 31.6351 11.144H31.7791C32.0991 11.144 32.4351 11.048 32.6271 10.792V10.6ZM42.0469 9.768C42.0469 10.088 41.9829 10.376 41.9029 10.52C40.9909 11.896 39.4069 12.408 37.8389 12.728H37.5509C36.5269 12.728 35.4549 12.328 34.8469 11.432C34.6549 11.048 34.5429 10.568 34.5429 10.104C34.5429 9.608 34.6709 9.128 34.9429 8.76C35.5029 7.672 36.5589 6.888 37.5989 6.296C37.6789 6.28 38.0949 6.136 38.4949 6.136C38.7189 6.136 38.9429 6.184 39.0869 6.328C39.2629 6.744 39.6789 6.856 40.0309 7C40.9589 7.256 41.7589 8.04 41.9189 9C41.9989 9.224 42.0469 9.512 42.0469 9.768ZM40.8629 9.288C40.8629 8.184 38.8629 8.088 38.8469 7.88C38.7989 7.72 38.6709 7.624 38.5269 7.608C37.3269 8.184 35.9509 9.192 35.6629 10.6C35.6949 10.808 35.7429 11 35.9349 11.128C36.2389 11.32 36.6389 11.4 37.0389 11.4C37.4389 11.4 37.8229 11.32 38.1589 11.224C39.1509 10.92 40.4149 10.456 40.8629 9.4V9.288ZM51.8589 12.312C51.7949 12.52 51.5709 12.632 51.3629 12.648L51.2509 12.68C50.9149 12.68 50.7069 12.36 50.5789 12.088C50.3389 10.984 50.1789 9.832 49.5549 8.888C49.4269 9.032 49.3309 9.192 49.2509 9.352C48.8829 9.976 48.8669 11.08 48.3389 11.24C47.6989 11.208 47.5069 10.536 47.2989 10.056C46.7549 9.224 46.4829 8.264 45.9709 7.432C45.3149 7.672 44.8669 8.552 44.7869 9.224C44.6269 10.488 44.4669 11.672 44.1629 12.904C44.0189 13 43.8589 13.064 43.6989 13.096L43.4109 13C43.1069 12.904 42.9309 12.616 42.8669 12.312C43.0909 10.488 43.2509 8.584 43.2509 6.76C43.2989 6.632 43.2989 6.04 43.7469 5.928L43.8909 5.896C44.2109 5.896 44.4189 6.168 44.6589 6.328C44.9309 5.992 45.0749 5.48 45.5549 5.4C46.2429 5.4 46.8189 5.896 47.1389 6.472C47.5549 7.064 47.6029 7.832 47.9869 8.456C48.6749 7.864 48.6269 6.792 49.8589 6.664L49.9229 6.68C50.6589 7.016 50.8509 7.816 51.0589 8.664L51.6989 11.288C51.8589 11.544 51.7789 11.864 51.8749 12.152L51.8589 12.312Z"
              fill="#A19F9B"
              style={{ fill: "#A19F9B", fillOpacity: 1 }}
            />
          </g>
        </svg>
      </div>

      {/* Phone Frame */}
      <div
        className={cn(
          "relative w-[375px] h-[812px] rounded-[40px] overflow-hidden shadow-2xl border-4 transition-colors duration-500",
          isDark
            ? "bg-[#050505] border-zinc-900"
            : "bg-white border-zinc-100",
        )}
      >
        {/* Glow Container */}
        <motion.div
          className="absolute w-[1700px] h-[2400px] pointer-events-none"
          style={{
            maskImage:
              "linear-gradient(to bottom, black 30%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 30%, transparent 100%)",
          }}
          animate={{
            opacity: power ? 1 : 0,
            scale: glowScale,
            left: positionX,
            top: positionY,
          }}
          transition={transition}
        >
          {/* Shape 1 (Large, Background) */}
          <motion.div
            className={cn(
              "absolute top-[400px] left-[300px] w-[1800px] rounded-full opacity-40",
              isDark ? "mix-blend-screen" : "mix-blend-normal",
            )}
            style={{
              backgroundColor: color,
              height: `${1800 * maskSize + 600}px`, // Dynamic size based on maskSize (doubled)
              filter: "blur(180px)", // Adjusted blur
            }}
            animate={{
              height: `${1800 * maskSize + 600}px`,
            }}
            transition={transition}
          />

          {/* Shape 2 (Medium) */}
          <motion.div
            className={cn(
              "absolute top-[600px] left-[460px] w-[1300px] h-[1300px] rounded-full opacity-60",
              isDark ? "mix-blend-screen" : "mix-blend-normal",
            )}
            style={{
              backgroundColor: color,
              filter: "blur(120px)",
            }}
            transition={transition}
          />

          {/* Shape 3 (Core Color) */}
          <motion.div
            className={cn(
              "absolute top-[700px] left-[560px] w-[1000px] h-[800px] rounded-full",
              isDark ? "mix-blend-screen" : "mix-blend-normal",
            )}
            style={{
              backgroundColor: color,
              filter: "blur(60px)",
              opacity: isDark ? 1 : 0.6,
            }}
            transition={transition}
          />

          {/* Highlight (White Core) */}
          <motion.div
            className="absolute top-[800px] left-[700px] w-[600px] h-[440px] rounded-full mix-blend-normal"
            style={{
              backgroundColor: "#FFFFFF",
              filter: isDark ? "blur(80px)" : "blur(100px)", // More diffuse in light mode?
            }}
            animate={{
              filter: isDark ? "blur(80px)" : "blur(120px)", // Adjust blur based on theme
              opacity: isDark ? 0.4 : 0.7,
            }}
            transition={transition}
          />
        </motion.div>

        {/* Noise Overlay */}
        <motion.div
          className="absolute inset-0 w-full h-full pointer-events-none z-[5] mix-blend-overlay"
          style={{
            backgroundImage: `url("${noiseSvg}")`,
            backgroundRepeat: "repeat",
            backgroundSize: "200px 200px",
          }}
          animate={{
            opacity: noiseEnabled && power ? noiseIntensity : 0,
          }}
          transition={transition}
        />

        {/* UI Overlay */}
        <div className="absolute bottom-0 w-full p-8 pb-12 flex flex-col gap-6 z-10">
          {/* Workspace Icon */}
          <div
            className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 cursor-pointer hover:bg-white/20 transition-colors"
            onClick={handleSpotlightClick}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke={isDark ? "white" : "black"}
              strokeOpacity="0.8"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15.295 19.562 16 22" />
              <path d="m17 16 3.758 2.098" />
              <path d="m19 12.5 3.026-.598" />
              <path d="M7.61 6.3a3 3 0 0 0-3.92 1.3l-1.38 2.79a3 3 0 0 0 1.3 3.91l6.89 3.597a1 1 0 0 0 1.342-.447l3.106-6.211a1 1 0 0 0-.447-1.341z" />
              <path d="M8 9V2" />
            </svg>
          </div>

          {/* Text Content */}
          <div>
            <div
              className={cn(
                "text-xs font-medium tracking-widest uppercase mb-2 transition-colors",
                isDark ? "text-white/60" : "text-black/60",
              )}
            >
              Collaboration Hub
            </div>
            <h1
              className={cn(
                "text-3xl font-bold leading-tight mb-4 transition-colors",
                isDark ? "text-white" : "text-black",
              )}
            >
              Get More Done
              <br />
              Together
            </h1>
            <p
              className={cn(
                "text-sm leading-relaxed transition-colors",
                isDark ? "text-white/60" : "text-black/60",
              )}
            >
              Stay aligned, share ideas, and keep every project
              moving smoothly.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3 mt-4">
            <button
              className={cn(
                "w-full h-12 rounded-full flex items-center justify-center gap-3 font-medium transition-colors",
                isDark
                  ? "bg-white text-black hover:bg-white/90"
                  : "bg-black text-white hover:bg-black/90",
              )}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
              >
                <path
                  d="M16.92 9.1875C16.92 8.6025 16.8675 8.04 16.77 7.5H9V10.695H13.44C13.245 11.7225 12.66 12.5925 11.7825 13.1775V15.255H14.46C16.02 13.815 16.92 11.7 16.92 9.1875Z"
                  fill="#4285F4"
                />
                <path
                  d="M9 17.25C11.2275 17.25 13.095 16.515 14.46 15.255L11.7825 13.1775C11.0475 13.6725 10.11 13.9725 9 13.9725C6.855 13.9725 5.0325 12.525 4.38 10.575H1.635V12.705C2.9925 15.3975 5.775 17.25 9 17.25Z"
                  fill="#34A853"
                />
                <path
                  d="M4.38 10.5675C4.215 10.0725 4.1175 9.5475 4.1175 9C4.1175 8.4525 4.215 7.9275 4.38 7.4325V5.3025H1.635C1.0725 6.4125 0.75 7.665 0.75 9C0.75 10.335 1.0725 11.5875 1.635 12.6975L3.7725 11.0325L4.38 10.5675Z"
                  fill="#FBBC05"
                />
                <path
                  d="M9 4.035C10.215 4.035 11.295 4.455 12.1575 5.265L14.52 2.9025C13.0875 1.5675 11.2275 0.75 9 0.75C5.775 0.75 2.9925 2.6025 1.635 5.3025L4.38 7.4325C5.0325 5.4825 6.855 4.035 9 4.035Z"
                  fill="#EA4335"
                />
              </svg>
              Continue With Google
            </button>
            <button
              className={cn(
                "w-full h-12 rounded-full flex items-center justify-center font-medium transition-colors",
                isDark
                  ? "bg-white/10 text-white/80 hover:bg-white/20"
                  : "bg-black/5 text-black/60 hover:bg-black/10",
              )}
            >
              Skip
            </button>
          </div>
        </div>

        {/* Discrete Link */}
        <a
          href="https://ap.cx"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "absolute bottom-2 left-1/2 -translate-x-1/2 text-[11px] z-10 transition-colors opacity-50 hover:opacity-80",
            isDark ? "text-white/50" : "text-black/40",
          )}
        >
          ap.cx
        </a>
      </div>
    </div>
  );
}
