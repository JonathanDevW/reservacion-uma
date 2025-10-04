// Aplicación principal
const App = {
    init: function() {
        this.initializeModules();
        this.setupEventListeners();
        this.showScreen('searchScreen');
        
        console.log('🚀 Sistema de Reserva de Salas - UMA Santa Ana');
        console.log('📍 Inicializado correctamente');
    },

    initializeModules: function() {
        SearchModule.init();
        ReservationModule.init();
    },

    setupEventListeners: function() {
        // Event listeners globales si son necesarios
    },

    showScreen: function(screenId) {
        // Ocultar todas las pantallas
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Mostrar la pantalla solicitada
        document.getElementById(screenId).classList.add('active');

        // Actualizar breadcrumb
        this.updateBreadcrumb(screenId);
    },

    updateBreadcrumb: function(screenId) {
        const breadcrumb = document.getElementById('breadcrumb');
        const breadcrumbs = {
            'searchScreen': '<span class="text-blue-400">Inicio</span> > Búsqueda de Salas',
            'detailScreen': '<span class="text-blue-400 cursor-pointer" onclick="App.showScreen(\'searchScreen\')">Inicio</span> > <span class="text-blue-400 cursor-pointer" onclick="App.showScreen(\'searchScreen\')">Búsqueda</span> > Detalle de Sala',
            'confirmationScreen': '<span class="text-blue-400 cursor-pointer" onclick="App.showScreen(\'searchScreen\')">Inicio</span> > <span class="text-blue-400 cursor-pointer" onclick="App.showScreen(\'searchScreen\')">Búsqueda</span> > <span class="text-blue-400 cursor-pointer" onclick="App.showScreen(\'detailScreen\')">Detalle</span> > Confirmación'
        };

        breadcrumb.innerHTML = breadcrumbs[screenId] || breadcrumbs['searchScreen'];
    }
};

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    App.init();
});

// Funciones globales para los botones HTML
function searchRooms() {
    SearchModule.searchRooms();
}

function clearSearch() {
    SearchModule.clearSearch();
}