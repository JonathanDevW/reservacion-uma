// Módulo de reservas
const ReservationModule = {
    currentReservation: {},
    userEmail: 'estudiante@uma.edu.sv',

    init: function() {
        this.loadUserInfo();
    },

    loadUserInfo: function() {
        document.getElementById('userInfo').textContent = 'Juan Pérez';
    },

    selectRoom: function(roomId) {
        const room = RoomsData.find(r => r.id === roomId);
        if (!room) {
            Utils.showNotification('Sala no encontrada', 'error');
            return;
        }

        if (!room.available) {
            Utils.showNotification('Esta sala no está disponible actualmente', 'error');
            return;
        }

        const date = document.getElementById('searchDate').value;
        const time = document.getElementById('searchTime').value;
        const duration = document.getElementById('searchDuration').value;
        const attendees = parseInt(document.getElementById('searchAttendees').value);

        this.currentReservation = {
            room: room,
            date: date,
            time: time,
            duration: duration,
            attendees: attendees
        };

        this.showDetailScreen();
    },

    showDetailScreen: function() {
        const { room, date, time, duration } = this.currentReservation;

        const detailScreen = document.getElementById('detailScreen');
        detailScreen.innerHTML = `
            <div class="max-w-4xl mx-auto">
                <div class="breadcrumb mb-6">
                    <span class="text-blue-400 cursor-pointer" onclick="App.showScreen('searchScreen')">Inicio</span> > 
                    <span class="text-blue-400 cursor-pointer" onclick="App.showScreen('searchScreen')">Búsqueda</span> > 
                    <span class="text-gray-400">Detalle de Reserva</span>
                </div>

                <div class="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden shadow-2xl">
                    <!-- Header -->
                    <div class="bg-gradient-to-r from-gray-700 to-gray-800 p-6 border-b border-gray-600">
                        <h2 class="text-3xl font-bold text-white mb-2">${room.name}</h2>
                        <div class="flex items-center gap-4 text-gray-300">
                            <span class="flex items-center gap-1">
                                👥 Capacidad: ${room.capacity} personas
                            </span>
                            <span class="w-1 h-1 bg-gray-500 rounded-full"></span>
                            <span class="flex items-center gap-1">
                                🏷️ Sala ${room.id}
                            </span>
                        </div>
                    </div>

                    <div class="p-8">
                        <!-- Información de la reserva -->
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div class="bg-gray-700 p-4 rounded-lg border border-gray-600">
                                <div class="text-sm text-gray-400 mb-1">📅 Fecha</div>
                                <div class="text-white font-semibold">${Utils.formatDate(date)}</div>
                            </div>
                            <div class="bg-gray-700 p-4 rounded-lg border border-gray-600">
                                <div class="text-sm text-gray-400 mb-1">🕐 Horario</div>
                                <div class="text-white font-semibold">${time} - ${Utils.calculateEndTime(time, duration)}</div>
                            </div>
                            <div class="bg-gray-700 p-4 rounded-lg border border-gray-600">
                                <div class="text-sm text-gray-400 mb-1">⏱️ Duración</div>
                                <div class="text-white font-semibold">${duration} minutos</div>
                            </div>
                        </div>

                        <!-- Equipamiento -->
                        <div class="mb-8">
                            <h3 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                🛠️ Equipamiento Disponible
                            </h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                                ${room.equipment.map(item => `
                                    <div class="flex items-center gap-3 bg-gray-700 p-3 rounded-lg border border-gray-600">
                                        <div class="w-2 h-2 bg-green-400 rounded-full"></div>
                                        <span class="text-white">${item}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <!-- Formulario de reserva -->
                        <div class="bg-gray-700 rounded-xl p-6 border border-gray-600">
                            <h3 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                📝 Detalles de la Reserva
                            </h3>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label class="block text-sm font-medium text-gray-300 mb-2">👥 Número de asistentes</label>
                                    <input type="number" id="reservationAttendees" min="1" max="${room.capacity}" value="${this.currentReservation.attendees}"
                                        class="w-full bg-gray-600 border border-gray-500 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-300 mb-2">🎯 Motivo de la reserva</label>
                                    <select id="reservationReason" 
                                        class="w-full bg-gray-600 border border-gray-500 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                        <option value="estudio">Estudio individual/grupal</option>
                                        <option value="tutoria">Tutoría académica</option>
                                        <option value="evento">Evento oficial/Examen</option>
                                        <option value="otro">Otro</option>
                                    </select>
                                </div>
                            </div>

                            <div class="mb-6">
                                <label class="block text-sm font-medium text-gray-300 mb-2">📋 Descripción adicional (opcional)</label>
                                <textarea id="reservationDescription" rows="3" 
                                    class="w-full bg-gray-600 border border-gray-500 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    placeholder="Describa el propósito de la reserva..."></textarea>
                            </div>

                            <div class="flex gap-4">
                                <button onclick="App.showScreen('searchScreen')" 
                                    class="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 border border-gray-500 hover:border-gray-400">
                                    ← Volver a Búsqueda
                                </button>
                                <button onclick="ReservationModule.confirmReservation()" 
                                    class="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg pulse-glow">
                                    ✅ Confirmar Reserva
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        App.showScreen('detailScreen');
    },

    confirmReservation: function() {
        const attendees = document.getElementById('reservationAttendees').value;
        const reason = document.getElementById('reservationReason').value;
        const description = document.getElementById('reservationDescription').value;

        // Validaciones
        if (!attendees || attendees < 1) {
            Utils.showNotification('Por favor, ingrese el número de asistentes', 'error');
            return;
        }

        if (attendees > this.currentReservation.room.capacity) {
            Utils.showNotification(`La capacidad máxima es ${this.currentReservation.room.capacity} personas`, 'error');
            return;
        }

        // Completar datos de la reserva
        this.currentReservation.attendees = parseInt(attendees);
        this.currentReservation.reason = reason;
        this.currentReservation.description = description;
        this.currentReservation.code = Utils.generateReservationCode();
        this.currentReservation.userEmail = this.userEmail;

        this.showConfirmationScreen();
        this.sendConfirmationEmail();
    },

    showConfirmationScreen: function() {
        const { room, date, time, duration, attendees, reason, description, code } = this.currentReservation;

        const confirmationScreen = document.getElementById('confirmationScreen');
        confirmationScreen.innerHTML = `
            <div class="max-w-4xl mx-auto">
                <div class="breadcrumb mb-6">
                    <span class="text-blue-400 cursor-pointer" onclick="App.showScreen('searchScreen')">Inicio</span> > 
                    <span class="text-blue-400 cursor-pointer" onclick="App.showScreen('searchScreen')">Búsqueda</span> > 
                    <span class="text-blue-400 cursor-pointer" onclick="App.showScreen('detailScreen')">Detalle</span> > 
                    <span class="text-gray-400">Confirmación</span>
                </div>

                <!-- Mensaje de confirmación -->
                <div class="bg-gradient-to-r from-green-900 to-blue-900 border border-green-500 rounded-2xl p-8 mb-8 text-center shadow-2xl">
                    <div class="text-6xl mb-4">✅</div>
                    <h2 class="text-4xl font-bold text-white mb-4">¡Reserva Confirmada!</h2>
                    <p class="text-xl text-gray-200">
                        Se ha enviado un correo de confirmación a: 
                        <strong class="text-white">${this.userEmail}</strong>
                    </p>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <!-- Detalles de la reserva -->
                    <div class="lg:col-span-2">
                        <div class="bg-gray-800 rounded-2xl border border-gray-700 p-8">
                            <h3 class="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                📋 Detalles de la Reserva
                            </h3>
                            
                            <div class="space-y-4">
                                <div class="flex justify-between items-center py-3 border-b border-gray-700">
                                    <span class="text-gray-400">Código de reserva:</span>
                                    <span class="text-white font-mono font-bold">${code}</span>
                                </div>
                                <div class="flex justify-between items-center py-3 border-b border-gray-700">
                                    <span class="text-gray-400">Sala:</span>
                                    <span class="text-white font-semibold">${room.name} (Capacidad: ${room.capacity} personas)</span>
                                </div>
                                <div class="flex justify-between items-center py-3 border-b border-gray-700">
                                    <span class="text-gray-400">Fecha:</span>
                                    <span class="text-white">${Utils.formatDate(date)}</span>
                                </div>
                                <div class="flex justify-between items-center py-3 border-b border-gray-700">
                                    <span class="text-gray-400">Horario:</span>
                                    <span class="text-white">${time} - ${Utils.calculateEndTime(time, duration)} (${duration} minutos)</span>
                                </div>
                                <div class="flex justify-between items-center py-3 border-b border-gray-700">
                                    <span class="text-gray-400">Asistentes:</span>
                                    <span class="text-white">${attendees} personas</span>
                                </div>
                                <div class="flex justify-between items-center py-3 border-b border-gray-700">
                                    <span class="text-gray-400">Motivo:</span>
                                    <span class="text-white">${Utils.getReasonText(reason)}</span>
                                </div>
                                <div class="flex justify-between items-start py-3">
                                    <span class="text-gray-400">Descripción:</span>
                                    <span class="text-white text-right">${description || 'No especificada'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Información importante -->
                    <div>
                        <div class="bg-gray-800 rounded-2xl border border-gray-700 p-6 sticky top-8">
                            <h4 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                📌 Información Importante
                            </h4>
                            <ul class="space-y-3">
                                <li class="flex items-start gap-3 text-sm text-gray-300">
                                    <span class="text-blue-400 mt-1">⏰</span>
                                    <span>Llegue 5 minutos antes de su reserva</span>
                                </li>
                                <li class="flex items-start gap-3 text-sm text-gray-300">
                                    <span class="text-green-400 mt-1">✅</span>
                                    <span>Puede cancelar hasta 1 hora antes sin penalización</span>
                                </li>
                                <li class="flex items-start gap-3 text-sm text-gray-300">
                                    <span class="text-red-400 mt-1">⚠️</span>
                                    <span>La no presentación genera falta en el sistema</span>
                                </li>
                                <li class="flex items-start gap-3 text-sm text-gray-300">
                                    <span class="text-yellow-400 mt-1">🎫</span>
                                    <span>Presente su carnet al ingresar a la sala</span>
                                </li>
                            </ul>

                            <div class="mt-6 pt-6 border-t border-gray-700">
                                <div class="text-center text-xs text-gray-500 mb-4">
                                    Universidad Modular Abierta<br>
                                    Centro Regional Santa Ana
                                </div>
                                <div class="flex gap-2">
                                    <button onclick="App.showScreen('searchScreen')" 
                                        class="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 text-sm">
                                        ➕ Nueva Reserva
                                    </button>
                                    <button onclick="window.print()" 
                                        class="px-4 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 border border-gray-500 text-sm">
                                        🖨️ Imprimir
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        App.showScreen('confirmationScreen');
        Utils.showNotification('Reserva confirmada exitosamente', 'success');
    },

    sendConfirmationEmail: function() {
        // Simular envío de email
        console.log('📧 Email de confirmación enviado a:', this.userEmail);
        console.log('Detalles de la reserva:', this.currentReservation);
    }
};