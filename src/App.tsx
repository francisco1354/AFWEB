
import { useState } from 'react';
import PaginaAuth from './components/Pages/PaginaAuth';
import PaginaCarga from './components/Pages/PaginaCarga';
import PaginaPrincipal from './components/Pages/PaginaPrincipal';
import PaginaFFXIV from './components/Pages/PaginaFFXIV';
import PaginaColecciones from './components/Pages/PaginaColecciones';
import PaginaThug from './components/Pages/PaginaThug';
import PaginaGalegale from './components/Pages/PaginaGalegale';
import PaginaPost from './components/Pages/PaginaPost';
import PaginaContacto from './components/Pages/PaginaContacto';
import PaginaAdmin from './components/Pages/PaginaAdmin';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import { getActiveUser, type UserData } from './utils/validation';

function App() {
    //  Inicializamos con getActiveUser para persistencia de sesión
    const [currentUser, setCurrentUser] = useState<UserData | null>(getActiveUser());
    const [isAwaitingRedirect, setIsAwaitingRedirect] = useState(false);

    // Se ejecuta al ingresar credenciales correctas en LoginForm
    const handleLoginSuccess = (user: UserData) => {
        setCurrentUser(user);
        setIsAwaitingRedirect(true); // Activa la página de carga
    };
    
    // Se ejecuta cuando la PaginaCarga termina su temporizador
    const handleCargaComplete = () => {
        setIsAwaitingRedirect(false);
        // La vista principal se renderiza automáticamente porque currentUser != null
    };

    // Función para cerrar sesión
    const handleLogout = () => {
        localStorage.removeItem('currentUser'); // Limpia la sesión
        setCurrentUser(null); // Cambia el estado para renderizar PaginaAuth
    }
    
    // 1. RENDERIZAR LA PÁGINA DE CARGA SI ESTÁ ACTIVA (no footer aquí)
    if (isAwaitingRedirect && currentUser) {
        return <PaginaCarga user={currentUser} onComplete={handleCargaComplete} />;
    }

    // 2. Determinar la página a renderizar en base al pathname (mantener accesos públicos)
    const path = typeof window !== 'undefined' ? window.location.pathname : '/';
    let pageElement: any;

    // Si la ruta raíz '/' se carga, mostramos login sólo si no hay sesión activa.
    if (path === '/') {
        if (currentUser) {
            pageElement = <PaginaPrincipal currentUser={currentUser} onLogout={handleLogout} />;
        } else {
            pageElement = <PaginaAuth onLoginSuccess={handleLoginSuccess} />;
        }
    } else if (path === '/ffxiv') {
        pageElement = <PaginaFFXIV />;
    } else if (path === '/colecciones') {
        pageElement = <PaginaColecciones />;
    } else if (path === '/thug') {
        pageElement = <PaginaThug />;
    } else if (path === '/vsa' || path === '/galegale') {
        pageElement = <PaginaGalegale />;
    } else if (path === '/contacto') {
        pageElement = <PaginaContacto />;
    } else if (path === '/admin') {
        pageElement = <PaginaAdmin />;

    } else if (path.startsWith('/post/')) {
        pageElement = <PaginaPost />;
    } else if (currentUser) {
        // Usuario autenticado: mostrar página principal
        pageElement = <PaginaPrincipal currentUser={currentUser} onLogout={handleLogout} />;
    } else {
        // Usuario no autenticado y ruta no pública: mostrar auth
        pageElement = <PaginaAuth onLoginSuccess={handleLoginSuccess} />;
    }

    // 3. Mostrar footer en todas las páginas excepto la de autenticación (PaginaAuth)
    const showFooter = !(pageElement && (pageElement.type === PaginaAuth));

    return (
        <>
            {pageElement}
            {showFooter ? <Chatbot /> : null}
            {showFooter ? <Footer /> : null}
        </>
    );
}

export default App;