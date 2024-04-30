const errorMessages = document.querySelectorAll('#error-message');

function showError(errorIndex) {
  errorMessages.forEach((errorMessage) => {
    errorMessage.classList.remove('alert');
  });

  errorMessages[errorIndex].classList.toggle('alert');
  setTimeout(() => {
    errorMessages[errorIndex].classList.remove('alert');
  }, 5000);
}

function findAlertedError(className) {
  return Array.from(errorMessages).find((e) => e.classList.contains(className));
}
