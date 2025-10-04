// Módulo de búsqueda de salas
const SearchModule = {
    currentFilters: {},

    init: function() {
        this.initializeDate();
        this.initializeTimeSlots();
        this.loadDefaultRooms();
    },

    initializeDate: function() {
        const dateInput = document.getElementById('searchDate');
        const today = new Date();
        const minDate = new Date();
        minDate.setDate(today.getDate() + Config.reservation.minAdvanceDays);
        const maxDate = new Date();
        maxDate.setDate(today.getDate() + Config.reservation.maxAdvanceDays);

        dateInput.min = minDate.toISOString().split('T')[0];
        dateInput.max = maxDate.toISOString().split('T')[0];
        
        // Fecha por defecto (2 días desde hoy)
        const defaultDate = new Date();
        defaultDate.setDate(today.getDate() + 2);
        dateInput.value = defaultDate.toISOString().split('T')[0];
    },

    initializeTimeSlots: function() {
        const timeSelect = document.getElementById('searchTime');
        const startHour = 7; // 7:00 AM
        const endHour = 21; // 9:00 PM

        timeSelect.innerHTML = '<option value="">Seleccionar hora</option>';

        for (let hour = startHour; hour < endHour; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                const option = document.createElement('option');
                option.value = timeString;
                option.textContent = timeString;
                timeSelect.appendChild(option);
            }
        }

        timeSelect.value = '09:00';
    },

    loadDefaultRooms: function() {
        const roomsGrid = document.getElementById('roomsGrid');
        roomsGrid.innerHTML = `
            <div class="col-span-full text-center py-12">
                <div class="text-gray-500 text-lg">
                    🏫 Ingrese los criterios de búsqueda para ver las salas disponibles
                </div>
            </div>
        `;
    },

    searchRooms: function() {
        const date = document.getElementById('searchDate').value;
        const time = document.getElementById('searchTime').value;
        const duration = document.getElementById('searchDuration').value;
        const attendees = parseInt(document.getElementById('searchAttendees').value);
        const equipment = document.getElementById('searchEquipment').value;

        if (!date || !time) {
            Utils.showNotification('Por favor, seleccione fecha y hora', 'error');
            return;
        }

        this.currentFilters = { date, time, duration, attendees, equipment };
        this.performSearch();
    },

    performSearch: function() {
        const { date, time, duration, attendees, equipment } = this.currentFilters;

        // Simular búsqueda (en producción, sería una llamada API)
        const filteredRooms = RoomsData.filter(room => {
            if (room.capacity < attendees) return false;
            if (equipment && !room.equipment.some(eq => eq.toLowerCase().includes(equipment))) {
                return false;
            }
            return room.available;
        });

        this.displayResults(filteredRooms);
    },

    displayResults: function(rooms) {
        const roomsGrid = document.getElementById('roomsGrid');
        const searchResults = document.getElementById('searchResults');

        if (rooms.length === 0) {
            roomsGrid.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <div class="text-yellow-500 text-lg mb-4">🔍 No se encontraron salas disponibles</div>
                    <p class="text-gray-400">Intente ajustar los criterios de búsqueda</p>
                </div>
            `;
            searchResults.textContent = 'No hay salas disponibles para los criterios seleccionados';
            return;
        }

        searchResults.textContent = `Mostrando ${rooms.length} sala${rooms.length !== 1 ? 's' : ''} disponible${rooms.length !== 1 ? 's' : ''}`;

        roomsGrid.innerHTML = rooms.map(room => `
            <div class="room-card bg-gray-800 rounded-xl border border-gray-700 p-6 hover:border-blue-500 transition-all duration-300">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h3 class="text-xl font-bold text-white mb-1">${room.name}</h3>
                        <div class="flex items-center gap-2 text-sm text-gray-400">
                            <span>👥 ${room.capacity} personas</span>
                            <span class="w-1 h-1 bg-gray-600 rounded-full"></span>
                            <span class="text-green-400">✅ Disponible</span>
                        </div>
                    </div>
                    <div class="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                        Sala ${room.id}
                    </div>
                </div>

                <div class="mb-4">
                    <h4 class="text-sm font-semibold text-gray-300 mb-2">🛠️ Equipamiento:</h4>
                    <div class="flex flex-wrap gap-2">
                        ${room.equipment.map(item => `
                            <span class="equipment-item bg-gray-700 px-3 py-1 rounded-lg text-xs border border-gray-600 cursor-default">
                                ${item}
                            </span>
                        `).join('')}
                    </div>
                </div>

                <button onclick="ReservationModule.selectRoom('${room.id}')" 
                    class="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                    📅 Reservar Esta Sala
                </button>
            </div>
        `).join('');
    },

    clearSearch: function() {
        document.getElementById('searchDate').value = '';
        document.getElementById('searchTime').value = '09:00';
        document.getElementById('searchDuration').value = '120';
        document.getElementById('searchAttendees').value = '4';
        document.getElementById('searchEquipment').value = '';
        document.getElementById('roomsGrid').innerHTML = '';
        document.getElementById('searchResults').textContent = 'Ingrese los criterios de búsqueda y haga clic en "Buscar Salas"';
        
        this.loadDefaultRooms();
    }
};

// Datos de ejemplo de salas
const RoomsData = [
    {
        id: 'A',
        name: 'Sala de Estudio A',
        capacity: 4,
        equipment: ['Mesa + sillas', 'Pizarrón', 'WiFi'],
        available: true
    },
    {
        id: 'B',
        name: 'Sala Multimedia B',
        capacity: 6,
        equipment: ['Mesa + sillas', 'TV', 'Proyector', 'WiFi'],
        available: true
    },
    {
        id: 'C',
        name: 'Sala Videoconferencia C',
        capacity: 8,
        equipment: ['Mesa + sillas', 'Proyector', 'Equipo para Videoconferencia', 'Computadora', 'WiFi'],
        available: false
    },
    {
        id: 'D',
        name: 'Sala de Reuniones D',
        capacity: 10,
        equipment: ['Mesa + sillas', 'Computadora fija', 'TV', 'Pizarrón', 'WiFi'],
        available: true
    },
    {
        id: 'E',
        name: 'Sala de Conferencias E',
        capacity: 12,
        equipment: ['Mesa + sillas', 'Pizarrón', 'Proyector', 'Computadora fija', 'Sistema de audio', 'WiFi'],
        available: true
    },
    {
        id: 'F',
        name: 'Sala Multimedia F',
        capacity: 6,
        equipment: ['Mesa + sillas', 'TV', 'Equipo para Videoconferencia', 'WiFi'],
        available: true
    }
];