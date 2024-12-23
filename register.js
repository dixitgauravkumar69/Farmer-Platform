function googleTranslateElementInit() {
    new google.translate.TranslateElement({
      pageLanguage: 'en',
      includedLanguages: 'en,hi,ta,te,gu,kn,ml,pa,bn,mr,or,ur,as,ne,si',
      layout: google.translate.TranslateElement.InlineLayout.SIMPLE
    }, 'google_translate_element');
  }

  // Load Google Translate script
  (function() {
    var gt = document.createElement('script'); gt.type = 'text/javascript'; gt.async = true;
    gt.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(gt, s);
  })(); 
  
  const districtData = {
    "Andhra Pradesh": ["Anantapur", "Chittoor", "East Godavari", "Guntur", "Kadapa", "Krishna"],
    "Arunachal Pradesh": ["Anjaw", "Changlang", "East Kameng", "East Siang", "Kra Daadi"],
    "Assam": ["Baksa", "Barpeta", "Biswanath", "Bongaigaon", "Cachar"],
    // Add more states and districts
  };
  
  function populateDistricts() {
    const stateSelect = document.getElementById("state");
    const districtSelect = document.getElementById("district");
    const selectedState = stateSelect.value;
  
    districtSelect.innerHTML = '<option value="">Select</option>';
  
    if (selectedState && districtData[selectedState]) {
      districtData[selectedState].forEach(district => {
        const option = document.createElement("option");
        option.value = district;
        option.textContent = district;
        districtSelect.appendChild(option);
      });
    }
  }
  