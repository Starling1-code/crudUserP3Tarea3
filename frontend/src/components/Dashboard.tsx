import { useState, useEffect } from "react";
import axios from "axios";

interface User {
    id: number;
    name: string;
    email: string;
}

export default function Dashboard() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:3000/api/users", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching users:", error);
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/";
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing && currentUser) {
                // Actualizar usuario existente
                const updateData = { name: formData.name, email: formData.email };
                if (formData.password) {
                    updateData.password = formData.password;
                }
                const response = await axios.put(
                    `http://localhost:3000/api/users/${currentUser.id}`,
                    updateData
                );
                setUsers(users.map((u) => (u.id === currentUser.id ? response.data : u)));
                setIsEditing(false);
                setCurrentUser(null);
            } else {
                // Crear nuevo usuario
                const response = await axios.post("http://localhost:3000/api/users", formData);
                setUsers([...users, response.data]);
            }
            setFormData({ name: "", email: "", password: "" });
            setShowForm(false);
        } catch (error) {
            console.error(isEditing ? "Error updating user:" : "Error creating user:", error);
        }
    };

    const handleEditUser = (user: User) => {
        setCurrentUser(user);
        setFormData({ name: user.name, email: user.email, password: "" });
        setIsEditing(true);
        setShowForm(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setCurrentUser(null);
        setFormData({ name: "", email: "", password: "" });
        setShowForm(false);
    };

    const handleDeleteUser = async (id: number) => {
        if (!confirm("¿Estás seguro de que deseas eliminar este usuario?")) return;
        try {
            await axios.delete(`http://localhost:3000/api/users/${id}`);
            setUsers(users.filter((u) => u.id !== id));
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <div className="header-content">
                    <h1>Dashboard</h1>
                    <button onClick={handleLogout} className="logout-btn">
                        Cerrar Sesión
                    </button>
                </div>
            </header>

            <main className="dashboard-main">
                <div className="dashboard-container">
                    <div className="section-header">
                        <h2>Usuarios</h2>
                        <button onClick={() => {
                            if (showForm) {
                                handleCancelEdit();
                            } else {
                                setShowForm(true);
                            }
                        }} className="btn-primary">
                            {showForm ? "Cancelar" : "+ Nuevo Usuario"}
                        </button>
                    </div>

                    {showForm && (
                        <div className="form-container">
                            <h3>{isEditing ? "Editar Usuario" : "Crear Nuevo Usuario"}</h3>
                            <form onSubmit={handleCreateUser}>
                                <input
                                    type="text"
                                    placeholder="Nombre"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                                <input
                                    type="password"
                                    placeholder={isEditing ? "Contraseña (no editable)" : "Contraseña"}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required={!isEditing}
                                    disabled={isEditing}
                                />
                                <button type="submit" className="btn-success">
                                    {isEditing ? "Actualizar Usuario" : "Crear Usuario"}
                                </button>
                            </form>
                        </div>
                    )}

                    {loading ? (
                        <p className="loading">Cargando usuarios...</p>
                    ) : users.length === 0 ? (
                        <p className="empty-state">No hay usuarios registrados</p>
                    ) : (
                        <div className="users-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nombre</th>
                                        <th>Email</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user.id}>
                                            <td>{user.id}</td>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>
                                                <button
                                                    onClick={() => handleEditUser(user)}
                                                    className="btn-edit"
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    className="btn-delete"
                                                >
                                                    Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
