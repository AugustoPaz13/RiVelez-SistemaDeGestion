import { useState } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogHeader, DialogTitle, DialogContent } from '../../components/ui/dialog';
import { Users, Plus, Edit, Trash2, Search, UserCheck, UserX } from 'lucide-react';
import { mockUsers } from '../../data';
import { User, UserRole } from '../../types';

export default function GestionUsuariosPage() {
    const [users, setUsers] = useState<User[]>(mockUsers);
    const [searchTerm, setSearchTerm] = useState('');
    const [showDialog, setShowDialog] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        nombre: '',
        role: 'cajero' as UserRole,
        activo: true,
    });

    const filteredUsers = users.filter(user =>
        user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAdd = () => {
        setEditingUser(null);
        setFormData({
            username: '',
            password: '',
            nombre: '',
            role: 'cajero',
            activo: true,
        });
        setShowDialog(true);
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setFormData({
            username: user.username,
            password: '',
            nombre: user.nombre,
            role: user.role,
            activo: user.activo,
        });
        setShowDialog(true);
    };

    const handleSave = () => {
        if (!formData.username || !formData.nombre) {
            alert('Complete los campos requeridos');
            return;
        }

        if (editingUser) {
            // Editar usuario existente
            setUsers(users.map(u =>
                u.id === editingUser.id
                    ? { ...u, ...formData, password: formData.password || u.password }
                    : u
            ));
        } else {
            // Nuevo usuario
            if (!formData.password) {
                alert('La contraseña es requerida para nuevos usuarios');
                return;
            }
            const newUser: User = {
                id: String(Date.now()),
                ...formData,
                fechaCreacion: new Date().toISOString().split('T')[0],
            };
            setUsers([...users, newUser]);
        }
        setShowDialog(false);
    };

    const handleToggleStatus = (userId: string) => {
        setUsers(users.map(u =>
            u.id === userId ? { ...u, activo: !u.activo } : u
        ));
    };

    const handleDelete = (userId: string) => {
        if (confirm('¿Está seguro de eliminar este usuario?')) {
            setUsers(users.filter(u => u.id !== userId));
        }
    };

    const getRoleLabel = (role: string) => {
        const labels: Record<string, string> = {
            'gerente': 'Gerente',
            'cajero': 'Cajero',
            'cocinero': 'Cocinero',
            'cliente': 'Cliente',
        };
        return labels[role] || role;
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#1e5d9e' }}>
            <Navbar />

            <div style={{ padding: '2rem' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    {/* Header */}
                    <div style={{ marginBottom: '2rem' }}>
                        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'white' }}>
                            <Users style={{ display: 'inline', width: '2rem', height: '2rem', marginRight: '0.5rem' }} />
                            G1: Gestionar Usuarios
                        </h1>
                        <p style={{ color: 'rgba(255,255,255,0.8)' }}>
                            Alta, baja, modificación y consulta de usuarios del sistema
                        </p>
                    </div>

                    {/* Barra de acciones */}
                    <Card style={{ marginBottom: '1.5rem', borderRadius: '1rem' }}>
                        <CardContent style={{ padding: '1rem', paddingTop: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div style={{ flex: 1, position: 'relative' }}>
                                <Search style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: '#9ca3af' }} />
                                <Input
                                    placeholder="Buscar usuarios..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{ paddingLeft: '2.5rem' }}
                                />
                            </div>
                            <button
                                onClick={handleAdd}
                                style={{
                                    backgroundColor: '#3b82f6',
                                    color: 'white',
                                    borderRadius: '0.5rem',
                                    padding: '0.75rem 1.5rem',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    fontSize: '0.875rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    transition: 'background-color 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
                            >
                                <Plus style={{ width: '1rem', height: '1rem' }} />
                                Nuevo Usuario
                            </button>
                        </CardContent>
                    </Card>

                    {/* Tabla de usuarios */}
                    <Card style={{ borderRadius: '1rem', overflow: 'hidden' }}>
                        <CardContent style={{ padding: 0 }}>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                                        <tr>
                                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', fontSize: '0.875rem', color: '#374151' }}>Usuario</th>
                                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', fontSize: '0.875rem', color: '#374151' }}>Nombre</th>
                                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', fontSize: '0.875rem', color: '#374151' }}>Rol</th>
                                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', fontSize: '0.875rem', color: '#374151' }}>Estado</th>
                                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', fontSize: '0.875rem', color: '#374151' }}>Fecha Creación</th>
                                            <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', fontSize: '0.875rem', color: '#374151' }}>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.map((user) => (
                                            <tr key={user.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                                <td style={{ padding: '1rem', fontSize: '0.875rem' }}>{user.username}</td>
                                                <td style={{ padding: '1rem', fontSize: '0.875rem' }}>{user.nombre}</td>
                                                <td style={{ padding: '1rem' }}>
                                                    <Badge variant="outline">{getRoleLabel(user.role)}</Badge>
                                                </td>
                                                <td style={{ padding: '1rem' }}>
                                                    <Badge variant={user.activo ? 'default' : 'secondary'}>
                                                        {user.activo ? 'Activo' : 'Inactivo'}
                                                    </Badge>
                                                </td>
                                                <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
                                                    {user.fechaCreacion || 'N/A'}
                                                </td>
                                                <td style={{ padding: '1rem' }}>
                                                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                                        <button
                                                            onClick={() => handleEdit(user)}
                                                            title="Editar usuario"
                                                            style={{ padding: '0.5rem', borderRadius: '0.5rem', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s' }}
                                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                        >
                                                            <Edit style={{ width: '1rem', height: '1rem', color: '#6b7280' }} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleToggleStatus(user.id)}
                                                            title={user.activo ? 'Desactivar usuario' : 'Activar usuario'}
                                                            style={{ padding: '0.5rem', borderRadius: '0.5rem', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s' }}
                                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                        >
                                                            {user.activo ? <UserX style={{ width: '1rem', height: '1rem', color: '#6b7280' }} /> : <UserCheck style={{ width: '1rem', height: '1rem', color: '#6b7280' }} />}
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(user.id)}
                                                            title="Eliminar usuario"
                                                            style={{ padding: '0.5rem', borderRadius: '0.5rem', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s' }}
                                                            onMouseEnter={(e) => {
                                                                e.currentTarget.style.backgroundColor = '#fee2e2';
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.currentTarget.style.backgroundColor = 'transparent';
                                                            }}
                                                        >
                                                            <Trash2 style={{ width: '1rem', height: '1rem', color: '#dc2626' }} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {filteredUsers.length === 0 && (
                                <div style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af' }}>
                                    No se encontraron usuarios
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Dialog de crear/editar usuario */}
            <Dialog open={showDialog} onClose={() => setShowDialog(false)}>
                <DialogHeader>
                    <DialogTitle>
                        {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
                    </DialogTitle>
                </DialogHeader>
                <DialogContent>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                                Usuario *
                            </label>
                            <Input
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                placeholder="username"
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                                Contraseña {editingUser && '(dejar vacío para mantener)'}
                            </label>
                            <Input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="••••••••"
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                                Nombre Completo *
                            </label>
                            <Input
                                value={formData.nombre}
                                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                placeholder="Juan Pérez"
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                                Rol *
                            </label>
                            <select
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    borderRadius: '0.375rem',
                                    border: '1px solid #d1d5db',
                                    fontSize: '0.875rem'
                                }}
                            >
                                <option value="cajero">Cajero</option>
                                <option value="cocinero">Cocinero</option>
                                <option value="gerente">Gerente</option>
                                <option value="cliente">Cliente</option>
                            </select>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <input
                                type="checkbox"
                                checked={formData.activo}
                                onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                                style={{ width: '1rem', height: '1rem' }}
                            />
                            <label style={{ fontSize: '0.875rem' }}>Usuario activo</label>
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                            <Button onClick={handleSave} style={{ flex: 1 }}>
                                Guardar
                            </Button>
                            <Button onClick={() => setShowDialog(false)} variant="outline" style={{ flex: 1 }}>
                                Cancelar
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
