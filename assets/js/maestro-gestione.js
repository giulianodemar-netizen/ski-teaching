// Maestro Gestione JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    initGestioneForm();
    initTimeSlotValidation();
});

// Initialize form functionality
function initGestioneForm() {
    const btnAggiungiNuovo = document.getElementById('btnAggiungiNuovo');
    const formNuovaLocalita = document.getElementById('formNuovaLocalita');
    const btnCloseForm = document.getElementById('btnCloseForm');
    
    if (btnAggiungiNuovo && formNuovaLocalita) {
        btnAggiungiNuovo.addEventListener('click', function() {
            formNuovaLocalita.style.display = 'block';
        });
    }
    
    if (btnCloseForm && formNuovaLocalita) {
        btnCloseForm.addEventListener('click', function() {
            formNuovaLocalita.style.display = 'none';
        });
    }
    
    // Initialize day checkboxes for time slot dropdowns
    populateDayDropdowns();
    
    // Initialize form submission with validation
    const form = document.querySelector('.localita-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateForm()) {
                // Form is valid, proceed with submission
                console.log('Form submitted successfully');
                // Here you would typically send the data to the server
            }
        });
    }
}

// Populate day dropdown options based on selected days
function populateDayDropdowns() {
    const giornoCheckboxes = document.querySelectorAll('input[name="giorni"]');
    const daySelects = document.querySelectorAll('.giorno-select');
    
    giornoCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateDayDropdowns();
        });
    });
    
    // Initial population
    updateDayDropdowns();
}

function updateDayDropdowns() {
    const selectedDays = [];
    const giornoCheckboxes = document.querySelectorAll('input[name="giorni"]:checked');
    
    giornoCheckboxes.forEach(checkbox => {
        selectedDays.push({
            value: checkbox.value,
            text: checkbox.nextElementSibling.textContent
        });
    });
    
    const daySelects = document.querySelectorAll('.giorno-select');
    daySelects.forEach(select => {
        // Save current selection
        const currentValue = select.value;
        
        // Clear options
        select.innerHTML = '<option value="">Seleziona giorno</option>';
        
        // Add selected days as options
        selectedDays.forEach(day => {
            const option = document.createElement('option');
            option.value = day.value;
            option.textContent = day.text;
            select.appendChild(option);
        });
        
        // Restore selection if still valid
        if (selectedDays.some(day => day.value === currentValue)) {
            select.value = currentValue;
        }
    });
}

// Initialize time slot validation
function initTimeSlotValidation() {
    const timeInputs = document.querySelectorAll('.time-input');
    
    timeInputs.forEach(input => {
        input.addEventListener('change', function() {
            validateTimeSlots();
        });
        
        input.addEventListener('blur', function() {
            validateTimeSlots();
        });
    });
}

// Validate that time slots are at least 1 hour apart
function validateTimeSlots() {
    const containers = [
        document.getElementById('orariPrivateContainer'),
        document.getElementById('orariGruppoContainer')
    ];
    
    containers.forEach(container => {
        if (!container) return;
        
        const dayGroups = container.querySelectorAll('.orari-group');
        
        dayGroups.forEach(group => {
            const daySelect = group.querySelector('.giorno-select');
            const timeInputs = group.querySelectorAll('.time-input');
            
            if (!daySelect.value) return; // Skip if no day selected
            
            const times = [];
            timeInputs.forEach(input => {
                if (input.value) {
                    times.push(input.value);
                }
            });
            
            // Sort times
            times.sort();
            
            // Check for minimum 1 hour difference
            for (let i = 0; i < times.length - 1; i++) {
                const time1 = parseTime(times[i]);
                const time2 = parseTime(times[i + 1]);
                
                const diffInMinutes = (time2.hours * 60 + time2.minutes) - (time1.hours * 60 + time1.minutes);
                
                if (diffInMinutes < 60) {
                    showTimeSlotError(group, `Gli orari devono essere distanziati di almeno 1 ora. Differenza tra ${times[i]} e ${times[i + 1]}: ${diffInMinutes} minuti.`);
                    return false;
                } else {
                    clearTimeSlotError(group);
                }
            }
        });
    });
    
    return true;
}

// Parse time string to hours and minutes
function parseTime(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    return { hours, minutes };
}

// Show time slot error
function showTimeSlotError(group, message) {
    // Remove existing error
    clearTimeSlotError(group);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'time-slot-error';
    errorDiv.style.color = '#e74c3c';
    errorDiv.style.fontSize = '12px';
    errorDiv.style.marginTop = '5px';
    errorDiv.textContent = message;
    
    group.appendChild(errorDiv);
}

// Clear time slot error
function clearTimeSlotError(group) {
    const existingError = group.querySelector('.time-slot-error');
    if (existingError) {
        existingError.remove();
    }
}

// Validate entire form
function validateForm() {
    // Validate required fields
    const requiredFields = [
        { selector: 'input[placeholder="ROCCARASO MARZO"]', name: 'Titolo' },
        { selector: 'input[placeholder="Inserisci località"]', name: 'Località' },
        { selector: '#dataInizio', name: 'Data inizio' },
        { selector: '#dataFine', name: 'Data fine' }
    ];
    
    for (let field of requiredFields) {
        const input = document.querySelector(field.selector);
        if (!input || !input.value.trim()) {
            alert(`Il campo ${field.name} è obbligatorio`);
            return false;
        }
    }
    
    // Validate at least one day selected
    const selectedDays = document.querySelectorAll('input[name="giorni"]:checked');
    if (selectedDays.length === 0) {
        alert('Seleziona almeno un giorno');
        return false;
    }
    
    // Validate at least one style selected
    const selectedStyles = document.querySelectorAll('input[name="stile"]:checked');
    if (selectedStyles.length === 0) {
        alert('Seleziona almeno uno stile');
        return false;
    }
    
    // Validate time slots
    if (!validateTimeSlots()) {
        return false;
    }
    
    // Validate date range
    const dataInizio = document.getElementById('dataInizio');
    const dataFine = document.getElementById('dataFine');
    
    if (dataInizio && dataFine && dataInizio.value && dataFine.value) {
        if (new Date(dataInizio.value) >= new Date(dataFine.value)) {
            alert('La data di fine deve essere successiva alla data di inizio');
            return false;
        }
    }
    
    return true;
}