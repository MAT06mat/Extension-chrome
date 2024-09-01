setDefault("companyName", "default");
setDefault("useGmail", false);
setDefault("disabled", false);
setDefault("increment", 0);

function setDefault(propName, propDefault) {
  chrome.storage.local.get([propName], (result) => {
    if (!result[propName]) {
      var prop = {}
      prop[propName] = propDefault
      chrome.storage.local.set(prop);
    }
  })
}


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "openMail") {
    chrome.storage.local.get(["companyName", "useGmail"], (result) => {
      if (request.alertPDF) {
        var alertPDF = request.alertPDF
      } else {
        var alertPDF = "*** Pensez à ajouter la pièce jointe (dernier fichier téléchargé) ***"
      }
      const mail = encodeURIComponent(
        `send-in@${result.companyName}.softgarden.io`
      );
      const subject = encodeURIComponent("[talentpool]");
      const body = encodeURIComponent(
        `${request.firstName}\n${request.lastName}\n${request.profileMail}\nm\nfr
        \n\n${alertPDF}`
      );
      if (result.useGmail) {
        chrome.tabs.create({
          url: `https://mail.google.com/mail/?view=cm&fs=1&to=${mail}&su=${subject}&body=${body}`,
        });
      } else {
        chrome.tabs.update({
          url: `mailto:${mail}?subject=${subject}&body=${body}`,
        });
      }
    });
  }
});
