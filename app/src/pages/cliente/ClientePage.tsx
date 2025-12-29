import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { SeleccionMesa } from '../../components/cliente/SeleccionMesa';
import { MenuDigital } from '../../components/cliente/MenuDigital';
import { RevisarPedido } from '../../components/cliente/RevisarPedido';
import { PantallaPago } from '../../components/cliente/PantallaPago';
import { Comprobante } from '../../components/cliente/Comprobante';
import { EstadoPedido } from '../../components/cliente/EstadoPedido';
import { mesasData, productosData } from '../../data/mockData';
import { ItemCarrito, Producto } from '../../types/restaurant';
import { toast, Toaster } from '../../components/ui/sonner';

type Pantalla = 'seleccion-mesa' | 'menu' | 'revisar-pedido' | 'pago' | 'estado-pedido' | 'comprobante';

export default function ClientePage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const mesaParam = searchParams.get('mesa');

    // Si viene mesa por QR, saltar directo al menú
    const [pantallaActual, setPantallaActual] = useState<Pantalla>(
        mesaParam ? 'menu' : 'seleccion-mesa'
    );

    const [mesaSeleccionada, setMesaSeleccionada] = useState<number | null>(
        mesaParam ? parseInt(mesaParam) : null
    );

    const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
    // const [pedidoConfirmado, setPedidoConfirmado] = useState(false);
    // const [pedidoEnviado, setPedidoEnviado] = useState<Date | null>(null);
    const [metodoPagoSeleccionado, setMetodoPagoSeleccionado] = useState<string>('');

    // Validar mesa del QR
    useEffect(() => {
        if (mesaParam) {
            const mesaNum = parseInt(mesaParam);

            // Validar que sea un número válido
            if (isNaN(mesaNum) || mesaNum < 1 || mesaNum > 50) {
                toast.error('Número de mesa inválido');
                navigate('/cliente');
                return;
            }

            // Validar que la mesa exista
            const mesaExiste = mesasData.find(m => m.numero === mesaNum);
            if (!mesaExiste) {
                toast.error(`Mesa ${mesaNum} no encontrada`);
                navigate('/cliente');
                return;
            }

            setMesaSeleccionada(mesaNum);
            setPantallaActual('menu');
            toast.success(`Bienvenido a Mesa ${mesaNum}`);
        }
    }, [mesaParam, navigate]);

    // Handlers para Selección de Mesa
    const handleSeleccionarMesa = (numeroMesa: number) => {
        setMesaSeleccionada(numeroMesa);
        setPantallaActual('menu');
    };

    const handleActualizarMesas = () => {
        console.log('Actualizando mesas...');
    };

    // Handlers para el Menú
    const handleAgregarAlCarrito = (producto: Producto) => {
        setCarrito(prev => {
            const itemExistente = prev.find(item => item.producto.id === producto.id);

            if (itemExistente) {
                return prev.map(item =>
                    item.producto.id === producto.id
                        ? { ...item, cantidad: item.cantidad + 1 }
                        : item
                );
            }

            return [...prev, { producto, cantidad: 1 }];
        });
    };

    const handleRemoverDelCarrito = (productoId: number) => {
        setCarrito(prev => {
            const itemExistente = prev.find(item => item.producto.id === productoId);

            if (!itemExistente) return prev;

            if (itemExistente.cantidad === 1) {
                return prev.filter(item => item.producto.id !== productoId);
            }

            return prev.map(item =>
                item.producto.id === productoId
                    ? { ...item, cantidad: item.cantidad - 1 }
                    : item
            );
        });
    };

    const handleIrARevisarPedido = () => {
        setPantallaActual('revisar-pedido');
    };

    const handleVolverAlMenu = () => {
        setPantallaActual('menu');
    };

    const handleVolverAMesas = () => {
        setMesaSeleccionada(null);
        setCarrito([]);
        // setPedidoConfirmado(false);
        // Si vino por QR, redirigir a /cliente sin parámetros
        navigate('/cliente');
        setPantallaActual('seleccion-mesa');
    };

    // Handlers para Revisar Pedido
    const handleEliminarItem = (productoId: number) => {
        setCarrito(prev => prev.filter(item => item.producto.id !== productoId));
    };

    const handleConfirmarPedido = () => {
        // setPedidoConfirmado(true);
        // setPedidoEnviado(new Date()); // Guardar timestamp para countdown
        setPantallaActual('pago');
        console.log('Pedido enviado a la cocina:', carrito);
        toast.success('Pedido enviado a cocina');
    };

    // Handlers para Pago
    const handleVolverAPedido = () => {
        setPantallaActual('revisar-pedido');
    };

    const handlePagoExitoso = (metodoPago: string) => {
        setMetodoPagoSeleccionado(metodoPago);
        setPantallaActual('estado-pedido'); // Cambiado: va a seguimiento en vez de comprobante
    };

    // Calcular total
    const calcularTotal = () => {
        const subtotal = carrito.reduce((sum, item) => sum + (item.producto.precio * item.cantidad), 0);
        const propina = subtotal * 0.10;
        return subtotal + propina;
    };

    return (
        <>
            <Toaster />
            {pantallaActual === 'seleccion-mesa' && (
                <SeleccionMesa
                    mesas={mesasData}
                    onSeleccionarMesa={handleSeleccionarMesa}
                    onActualizar={handleActualizarMesas}
                />
            )}

            {pantallaActual === 'menu' && mesaSeleccionada !== null && (
                <MenuDigital
                    productos={productosData}
                    carrito={carrito}
                    onAgregarAlCarrito={handleAgregarAlCarrito}
                    onRemoverDelCarrito={handleRemoverDelCarrito}
                    onIrARevisarPedido={handleIrARevisarPedido}
                    numeroMesa={mesaSeleccionada}
                    onVolverAMesas={handleVolverAMesas}
                />
            )}

            {pantallaActual === 'revisar-pedido' && mesaSeleccionada !== null && (
                <RevisarPedido
                    carrito={carrito}
                    numeroMesa={mesaSeleccionada}
                    onVolverAlMenu={handleVolverAlMenu}
                    onConfirmarPedido={handleConfirmarPedido}
                    onAgregarCantidad={(productoId) => {
                        const producto = carrito.find(i => i.producto.id === productoId)?.producto;
                        if (producto) handleAgregarAlCarrito(producto);
                    }}
                    onRemoverCantidad={handleRemoverDelCarrito}
                    onEliminarItem={handleEliminarItem}
                />
            )}

            {pantallaActual === 'pago' && mesaSeleccionada !== null && (
                <PantallaPago
                    total={calcularTotal()}
                    numeroMesa={mesaSeleccionada}
                    onVolverAPedido={handleVolverAPedido}
                    onPagoExitoso={handlePagoExitoso}
                />
            )}

            {pantallaActual === 'estado-pedido' && mesaSeleccionada !== null && (
                <EstadoPedido
                    numeroMesa={mesaSeleccionada}
                    items={carrito}
                    total={calcularTotal()}
                    metodoPago={metodoPagoSeleccionado}
                    onVolverAlInicio={handleVolverAMesas}
                />
            )}

            {pantallaActual === 'comprobante' && mesaSeleccionada !== null && (
                <Comprobante
                    numeroMesa={mesaSeleccionada}
                    items={carrito}
                    total={calcularTotal()}
                    metodoPago={metodoPagoSeleccionado}
                    onVolverAlInicio={handleVolverAMesas}
                />
            )}
        </>
    );
}
