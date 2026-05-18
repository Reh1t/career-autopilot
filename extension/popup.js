document.getElementById('autofill').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: autofillForm,
  });
});

function autofillForm() {
  // Mock data - In a real scenario, this would be fetched from the Engine API
  const profile = {
    first_name: "John",
    last_name: "Doe",
    email: "john.doe@example.com",
    phone: "1234567890",
    linkedin: "https://linkedin.com/in/johndoe"
  };

  // Greenhouse Mapping
  const mappings = {
    'first_name': ['first_name', 'name'],
    'last_name': ['last_name'],
    'email': ['email'],
    'phone': ['phone'],
    'linkedin': ['job_application_answers_attributes_0_text_value', 'linkedin']
  };

  for (const [key, selectors] of Object.entries(mappings)) {
    for (const selector of selectors) {
      const input = document.querySelector(`input[name*="${selector}"], input[id*="${selector}"]`);
      if (input) {
        input.value = profile[key];
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  }
  
  alert('Autofill complete! Please review and upload your tailored CV.');
}
