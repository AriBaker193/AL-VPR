export function initializePlayer() {

  const video = document.getElementById("video-player");
  const upload = document.getElementById("video-upload");

  const uploadButton =
      document.getElementById("upload-button");

  const playButton =
      document.getElementById("play-button");

  const fullscreenButton =
      document.getElementById("fullscreen-button");

  const overlay =
      document.getElementById("play-overlay");

  uploadButton.onclick = () => {

      upload.click();

  };

  upload.onchange = () => {

      const file = upload.files[0];

      if (!file) return;

      video.src = URL.createObjectURL(file);

  };

  function flash() {

      overlay.classList.add("show");

      setTimeout(() => {

          overlay.classList.remove("show");

      }, 150);

  }

  function togglePlay() {

      if (!video.src) return;

      if (video.paused) {

          video.play();

      } else {

          video.pause();

      }

  }

  playButton.onclick = togglePlay;

  video.onclick = togglePlay;

  video.addEventListener("play", () => {

      playButton.textContent = "⏸";

      flash();

  });

  video.addEventListener("pause", () => {

      playButton.textContent = "▶";

      flash();

  });

  fullscreenButton.onclick = () => {

      const container =
          document.getElementById("app-container");

      if (!document.fullscreenElement) {

          container.requestFullscreen();

      } else {

          document.exitFullscreen();

      }

  };

}