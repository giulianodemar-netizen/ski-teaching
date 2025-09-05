// Maestro Profilo JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    initProfileForm();
});

// Initialize profile form functionality
function initProfileForm() {
    const photoUpload = document.getElementById('photoUpload');
    const profileImage = document.getElementById('profileImage');
    const form = document.getElementById('maestroProfiloForm');
    
    // Handle photo upload
    if (photoUpload && profileImage) {
        photoUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    profileImage.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Handle form submission
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateProfileForm()) {
                // Form is valid, proceed with submission
                console.log('Profile form submitted successfully');
                alert('Profilo salvato con successo!');
            }
        });
    }
}

// Validate profile form
function validateProfileForm() {
    const requiredFields = [
        { id: 'nome', name: 'Nome' },
        { id: 'cognome', name: 'Cognome' },
        { id: 'nascita', name: 'Data di nascita' },
        { id: 'sesso', name: 'Sesso' },
        { id: 'codiceFiscale', name: 'Codice fiscale' },
        { id: 'cellulare', name: 'Numero di cellulare' },
        { id: 'tesserino', name: 'Numero tesserino' }
    ];
    
    for (let field of requiredFields) {
        const input = document.getElementById(field.id);
        if (!input || !input.value.trim()) {
            alert(`Il campo ${field.name} è obbligatorio`);
            input.focus();
            return false;
        }
    }
    
    // Validate at least one skill selected
    const selectedSkills = document.querySelectorAll('input[name="skills[]"]:checked');
    if (selectedSkills.length === 0) {
        alert('Seleziona almeno una skill');
        return false;
    }
    
    return true;
}