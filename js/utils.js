// Utilidades generales del sistema
const Utils = {
    // Formatear fecha
    formatDate: (dateString) => {
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    },

    // Calcular hora final
    calculateEndTime: (startTime, durationMinutes) => {
        const [hours, minutes] = startTime.split(':').map(Number);
        const totalMinutes = hours * 60 + minutes + parseInt(durationMinutes);
        const endHours = Math.floor(totalMinutes / 60);
        const endMinutes = totalMinutes % 60;
        return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
    },

    // Obtener texto del motivo
    getReasonText: (reason) => {
        const reasons = {
            'estudio': 'Estudio individual/grupal',
            'tutoria': 'Tutoría académica',
            'evento': 'Evento oficial/Examen',
            'otro': 'Otro'
        };
        return reasons[reason] || 'No especificado';
    },

    // Generar código de reserva
    generateReservationCode: () => {
        const timestamp = new Date().getTime();
        const random = Math.floor(Math.random() * 1000);
        return `RES-UMA-${timestamp}-${random}`;
    },

    // Validar email
    validateEmail: (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    // Mostrar notificación
    showNotification: (message, type = 'info') => {
        // Implementación simple de notificación
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg border-l-4 ${
            type === 'success' ? 'bg-green-900 border-green-400 text-green-200' :
            type === 'error' ? 'bg-red-900 border-red-400 text-red-200' :
            'bg-blue-900 border-blue-400 text-blue-200'
        } z-50 transform transition-transform duration-300 translate-x-full`;
        
        notification.innerHTML = `
            <div class="flex items-center">
                <span class="text-lg mr-2">${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(notification);

        // Animación de entrada
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);

        // Auto-remover después de 5 segundos
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 5000);
    }
};

// Configuración global
const Config = {
    university: {
        name: "Universidad Modular Abierta",
        campus: "Centro Regional Santa Ana",
        emailDomain: "@uma.edu.sv"
    },
    reservation: {
        minAdvanceDays: 2,
        maxAdvanceDays: 7,
        minDuration: 30,
        maxDuration: 180,
        cancelBeforeHours: 1
    },
    api: {
        baseUrl: "/api",
        endpoints: {
            rooms: "/rooms",
            reservations: "/reservations",
            users: "/users"
        }
    }
};