import React, { useEffect, useState } from 'react';
import NavBar from '../NavBar';
import '../../styles/Admin.css';

const PaginaAdmin: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [chat, setChat] = useState<any[]>([]);

  useEffect(() => {
    try {
      const p = localStorage.getItem('asfalto_posts');
      setPosts(p ? JSON.parse(p) : []);
    } catch (e) { setPosts([]); }
    try {
      const u = localStorage.getItem('users');
      setUsers(u ? JSON.parse(u) : []);
    } catch (e) { setUsers([]); }
    try {
      const c = localStorage.getItem('asfalto_chat');
      setChat(c ? JSON.parse(c) : []);
    } catch (e) { setChat([]); }
  }, []);

  const deletePost = (id: string) => {
    const next = posts.filter(p => p.id !== id);
    setPosts(next);
    localStorage.setItem('asfalto_posts', JSON.stringify(next));
  };

  const deleteUser = (nombre_usu: string) => {
    const next = users.filter((u: any) => u.nombre_usu !== nombre_usu);
    setUsers(next);
    localStorage.setItem('users', JSON.stringify(next));
  };

  const clearChat = () => {
    setChat([]);
    localStorage.removeItem('asfalto_chat');
  };

  return (
    <div className="admin-page">
      <NavBar />
      <main className="admin-main">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <h1>Panel Administrativo — Asfalto Fashion</h1>
            <p className="admin-intro">Aquí puedes revisar y administrar datos del sitio (posts, usuarios y chat). Esta es una vista inicial pensada para uso docente/administrador.</p>
          </div>
          <div>
            <button className="btn-primary" onClick={() => {
              // crear admin demo si no existe y activar flag de admin para la app
              try {
                const demo = { rut:'1-9', nombre:'Admin Uno', fecha_nac:'1990-01-01', correo:'admin@asfaltofashion.cl', nombre_usu:'admin01', password:'abc123' };
                const raw = localStorage.getItem('users');
                const arr = raw ? JSON.parse(raw) : [];
                const exists = arr.some((u: any) => u.nombre_usu === demo.nombre_usu || u.correo === demo.correo);
                if (!exists) {
                  arr.push(demo);
                  localStorage.setItem('users', JSON.stringify(arr));
                }
                // iniciar sesión como demo y marcar isAdmin
                localStorage.setItem('currentUser', JSON.stringify({ nombre_usu: demo.nombre_usu, nombre: demo.nombre, correo: demo.correo }));
                localStorage.setItem('isAdmin', 'true');
                // recargar para que NavBar detecte admin
                location.reload();
              } catch (e) {
                
              }
            }}>Crear admin demo</button>
            
            <button style={{ marginLeft: 12 }} className="btn-secondary" onClick={() => {
              try {
                if (!confirm('Restaurar publicaciones por defecto? Esto sobrescribirá las publicaciones actuales.')) return;
                const defaultPosts = [
                  { id: 'p1', title: 'Central Look LOOKBOOK', image: '/IMG/central.jpg', category: 'PERFIL', author: 'USUARIO_ASFALTO' },
                  { id: 'p2', title: 'Kai Style LOOKBOOK', image: '/IMG/kai.jpg', category: 'DESFILES', author: 'USUARIO_ASFALTO' },
                  { id: 'p3', title: 'Marlon Fashion LOOKBOOK', image: '/IMG/marlon.jpg', category: 'EDITORIAL', author: 'ASFALTOFASHION' },
                  { id: 'p4', title: 'Louis Vuitton x Final Fantasy — Lookbook', image: '/IMG/Louis-Vuitton-Final-Fantasy-Lightning-Square-Enix-2.webp', category: 'COLECCIONES', author: 'LOUIS VUITTON' },
                  // Young Thug: usar la imagen que existe en /public/IMG (nombre con espacio 'yun tug.jpg')
                  { id: 'p5', title: 'Young Thug - Backstage Look', image: '/IMG/yun tug.jpg', category: 'DESFILES', author: 'YUNGTHUG' },
                  { id: 'p6', title: 'VSA Collection — Street Editorial', image: '/IMG/ffxlv1.jpg', category: 'COLECCIONES', author: 'VSA' },
                  // Galegale tiene un video; MediaElement maneja .mp4 en la galería principal
                  { id: 'p7', title: 'Galegale — Video Editorial', image: '/IMG/galegale.mp4', category: 'EDITORIAL', author: 'GALEGale' }
                ];
                localStorage.setItem('asfalto_posts', JSON.stringify(defaultPosts));
                // recargar para que la UI muestre los posts restaurados
                location.reload();
              } catch (e) {
                // silencioso
              }
            }}>Restaurar publicaciones</button>
          </div>
        </div>

        <section className="admin-section">
          <h2>Publicaciones (posts)</h2>
          {posts.length === 0 ? <p>No hay publicaciones.</p> : (
            <ul className="admin-list">
              {posts.map(p => (
                <li key={p.id} className="admin-item">
                  {/* mostrar video si la ruta termina en .mp4, sino imagen */}
                  {typeof p.image === 'string' && p.image.toLowerCase().endsWith('.mp4') ? (
                    <video src={p.image} className="admin-thumb" controls muted loop />
                  ) : (
                    <img src={p.image} alt={p.title} className="admin-thumb" />
                  )}
                  <div className="admin-item-body">
                    <strong>{p.title}</strong>
                    <div className="admin-meta">{p.category} — {p.author}</div>
                  </div>
                  <div className="admin-actions">
                    <button onClick={() => deletePost(p.id)} className="btn-danger">Eliminar</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="admin-section">
          <h2>Usuarios</h2>
          {users.length === 0 ? <p>No hay usuarios registrados.</p> : (
            <ul className="admin-list">
              {users.map((u:any) => (
                <li key={u.nombre_usu} className="admin-item">
                  <div className="admin-item-body">
                    <strong>{u.nombre}</strong>
                    <div className="admin-meta">{u.nombre_usu} — {u.correo}</div>
                  </div>
                  <div className="admin-actions">
                    <button onClick={() => deleteUser(u.nombre_usu)} className="btn-danger">Eliminar</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="admin-section">
          <h2>Chat (registro)</h2>
          <p>Mensajes guardados en localStorage (`asfalto_chat`).</p>
          <div className="chat-log">
            {chat.length === 0 ? <p>No hay mensajes.</p> : chat.map((m:any, i:number) => (
              <div key={m.id || i} className={`chat-log-line ${m.from}`}>
                <span className="chat-log-from">{m.from}</span>
                <span className="chat-log-text">{m.text}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12 }}>
            <button onClick={clearChat} className="btn-danger">Borrar chat</button>
          </div>
        </section>

      </main>
    </div>
  );
};

export default PaginaAdmin;
