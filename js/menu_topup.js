// menu_topup.js (refactored, debug logged)
document.addEventListener("DOMContentLoaded", function () {
  const popupIds = ["popup-premium", "popup-login"];
  const containerIds = ["premium-container", "login-container"];

  popupIds.forEach((popupId, index) => {
    setupPopupExclusive(
      containerIds[index].replace("-container", "-button"),
      popupId,
      containerIds[index],
      popupIds
    );
  });

  function setupPopupExclusive(triggerId, popupId, containerId, allPopups) {
    const trigger = document.getElementById(triggerId);
    const popup = document.getElementById(popupId);
    const container = document.getElementById(containerId);

    if (!trigger || !popup || !container) {
      console.warn(`[setupPopupExclusive] Missing elements: ${triggerId}, ${popupId}, ${containerId}`);
      return;
    }

    let hoverTimeout;

    const showPopup = () => {
      clearTimeout(hoverTimeout);
      allPopups.forEach(id => {
        const otherPopup = document.getElementById(id);
        if (otherPopup && id !== popupId) {
          otherPopup.classList.add("hidden");
          otherPopup.classList.remove("flex", "block");
        }
      });
      popup.classList.remove("hidden");
      popup.classList.add("block");

      const rect = popup.getBoundingClientRect();
      if (rect.right > window.innerWidth) {
        popup.style.left = "auto";
        popup.style.right = "0";
      }
    };

    const hidePopup = () => {
      hoverTimeout = setTimeout(() => {
        popup.classList.add("hidden");
        popup.classList.remove("flex", "block");
      }, 100);
    };

    trigger.addEventListener("mouseenter", showPopup);
    popup.addEventListener("mouseenter", showPopup);
    container.addEventListener("mouseleave", hidePopup);
  }

  window.addEventListener("scroll", () => {
    popupIds.forEach(id => {
      const popup = document.getElementById(id);
      if (popup) popup.classList.add("hidden");
    });
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest("#premium-container") && !e.target.closest("#login-container")) {
      popupIds.forEach(id => {
        const popup = document.getElementById(id);
        if (popup) popup.classList.add("hidden");
      });
    }
  });

  window.toggleArrowAndPopup = function (el, targetId) {
    el.classList.toggle("active");

    const all = document.querySelectorAll(".popup-channel-grid");
    const target = document.getElementById(targetId);

    all.forEach(el => {
      if (el !== target) el.style.display = 'none';
    });

    if (target) {
      target.style.display = (target.style.display === 'block') ? 'none' : 'block';
    }

    updateArrow(target?.style.display === 'block');
    console.debug("[toggleArrowAndPopup] toggled:", targetId);
  };

  window.togglePopup = function (id) {
    const all = document.querySelectorAll(".popup-channel-grid");
    const target = document.getElementById(id);
    if (!target) {
      console.warn("[togglePopup] popup not found:", id);
      return;
    }
    all.forEach(el => {
      if (el !== target) el.style.display = 'none';
    });
    target.style.display = target.style.display === 'block' ? 'none' : 'block';
    updateArrow(target.style.display === 'block');
    console.debug("[togglePopup] toggled:", id);
  };

  function updateArrow(expanded) {
    document.querySelectorAll(".arrow-icon").forEach(icon => {
      if (expanded) icon.classList.add("rotate");
      else icon.classList.remove("rotate");
    });
  }
});
