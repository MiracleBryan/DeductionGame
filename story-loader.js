(() => {
    const story = window.getActiveStory?.();
    if (!story) return;

    const script = document.createElement("script");
    script.src = story.entry;
    document.body.appendChild(script);
})();