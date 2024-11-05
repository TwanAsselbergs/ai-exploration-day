function highlightEmails() {
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/g;
  const bodyText = document.body.innerHTML;
  const highlightedText = bodyText.replace(emailRegex, (email) => {
    return `<span style="background-color: yellow;">${email}</span>`;
  });
  document.body.innerHTML = highlightedText;
}
