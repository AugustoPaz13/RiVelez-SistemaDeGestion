import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { LogIn, User, Lock, AlertCircle } from 'lucide-react';

export default function LoginPage() {
    const { login, isLoading } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!username || !password) {
            setError('Por favor complete todos los campos');
            return;
        }

        const success = await login({ username, password });

        if (!success) {
            setError('Usuario o contraseña incorrectos');
        }
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0055A4 0%, #003d7a 100%)',
            padding: '20px',
        }}>
            {/* Logo */}
            <img
                src="logo-rivelez.png"
                alt="RiVelez Logo"
                style={{
                    width: '120px',
                    height: '120px',
                    marginBottom: '1.5rem',
                    filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))'
                }}
            />

            <h1 style={{
                color: 'white',
                fontSize: '2.5rem',
                marginBottom: '0.5rem',
                fontWeight: '700',
                textShadow: '2px 2px 8px rgba(0,0,0,0.3)'
            }}>
                RiVelez
            </h1>
            <p style={{
                color: 'rgba(255,255,255,0.9)',
                marginBottom: '2rem',
                fontSize: '1.1rem'
            }}>
                Sistema de Gestión
            </p>

            <Card style={{ width: '100%', maxWidth: '400px' }}>
                <CardHeader>
                    <CardTitle style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <LogIn className="w-5 h-5" />
                        Iniciar Sesión
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {/* Usuario */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                                Usuario
                            </label>
                            <div style={{ position: 'relative' }}>
                                <User style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: '#9ca3af' }} />
                                <Input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Ingrese su usuario"
                                    style={{ paddingLeft: '2.5rem' }}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* Contraseña */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                                Contraseña
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Lock style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: '#9ca3af' }} />
                                <Input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Ingrese su contraseña"
                                    style={{ paddingLeft: '2.5rem' }}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.75rem',
                                backgroundColor: '#fee2e2',
                                color: '#991b1b',
                                borderRadius: '0.375rem',
                                fontSize: '0.875rem'
                            }}>
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <Button type="submit" disabled={isLoading} style={{ width: '100%', marginTop: '0.5rem' }}>
                            {isLoading ? 'Ingresando...' : 'Ingresar'}
                        </Button>
                    </form>

                    {/* Credenciales de prueba */}
                    <div style={{
                        marginTop: '1.5rem',
                        padding: '1rem',
                        backgroundColor: '#f3f4f6',
                        borderRadius: '0.5rem',
                        fontSize: '0.75rem'
                    }}>
                        <p style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>Usuarios de prueba:</p>
                        <div style={{ color: '#6b7280', lineHeight: '1.6' }}>
                            <p>• <strong>Gerente:</strong> gerente / admin123</p>
                            <p>• <strong>Cajero:</strong> cajero1 / cajero123</p>
                            <p>• <strong>Cocinero:</strong> cocinero1 / cocina123</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <p style={{
                color: 'rgba(255,255,255,0.6)',
                marginTop: '2rem',
                fontSize: '0.875rem'
            }}>
                © 2025 RiVelez Restaurante
            </p>
        </div>
    );
}
